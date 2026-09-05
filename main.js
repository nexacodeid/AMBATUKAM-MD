/**
 * Ambatukam Multi-Device
 * Rebuild main.js
 * ada error fix sendiri,gw cmn rebuild main.js yang enc gw buat ulang
 * ga usah main shotgan klok pasang sc😹
 */

import './config.js';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import readline from 'node:readline';

import pino from 'pino';
import chalk from 'chalk';

import {
  Browsers,
  DisconnectReason,
  fetchLatestWaWebVersion,
  makeCacheableSignalKeyStore,
} from 'baileys';

import { shirokoku } from 'shirokoku';

import useSQLite from './lib/useSQLite.js';
import store from './lib/store.js';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import databaseHandler from './lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
 * PATHS
 * ========================================================= */

const SESSION_DIR = path.join(__dirname, 'sessions');
const DATABASE_FILE = path.join(__dirname, 'data', 'database.json');
const PLUGIN_DIR = path.join(__dirname, 'plugins');

fs.mkdirSync(SESSION_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DATABASE_FILE), { recursive: true });
fs.mkdirSync(PLUGIN_DIR, { recursive: true });

/* =========================================================
 * BAILEYS HELPERS
 * ========================================================= */

protoType();
serialize();

/* =========================================================
 * GLOBALS
 * ========================================================= */

global.__dirname = __dirname;

global.__filename = (
  url = import.meta.url,
  toPath = false
) => {
  const filename = fileURLToPath(url);
  return toPath ? filename : path.dirname(filename);
};

global.prefix = global.prefix || /^[.!#\\/]/;

global.conns = Array.isArray(global.conns)
  ? global.conns
  : [];

global.plugins =
  global.plugins ||
  Object.create(null);

/* =========================================================
 * GLOBAL API
 * ========================================================= */

global.API = function API(
  name,
  endpoint = '/',
  params = {},
  apiKeyName = 'apikey'
) {
  const base =
    global.APIs?.[name] ||
    name ||
    '';

  const normalizedBase =
    base.endsWith('/')
      ? base
      : `${base}/`;

  const url = new URL(
    endpoint,
    normalizedBase
  );

  for (const [key, value] of Object.entries(params || {})) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      url.searchParams.set(
        key,
        String(value)
      );
    }
  }

  if (
    apiKeyName &&
    global.APIKeys?.[base]
  ) {
    url.searchParams.set(
      apiKeyName,
      global.APIKeys[base]
    );
  }

  return url.toString();
};

/* =========================================================
 * GLOBAL LOADING
 * ========================================================= */

global.loading = async (
  m,
  conn,
  done = false
) => {
  if (!m?.chat || !conn) return;

  try {
    if (done) {
      if (m._loadingMessage) {
        await conn.sendMessage(
          m.chat,
          {
            delete:
              m._loadingMessage.key,
          }
        );

        m._loadingMessage = null;
      }

      return;
    }

    const sent =
      await conn.sendMessage(
        m.chat,
        {
          text:
            global.wait ||
            'Loading...',
        },
        {
          quoted: m,
        }
      );

    m._loadingMessage = sent;
  } catch {}
};

/* =========================================================
 * DATABASE
 * ========================================================= */

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

const defaultData = {
  users: {},
  chats: {},
  settings: {},
  stats: {},
  sticker: {},
  menfess: {},
  sewa: {},
  jadibotNumbers: {},
  jadibotOrders: {},
  jadibotAccess: {},
};

function readDatabase() {
  try {
    if (
      !fs.existsSync(
        DATABASE_FILE
      )
    ) {
      return clone(defaultData);
    }

    const raw =
      fs.readFileSync(
        DATABASE_FILE,
        'utf8'
      );

    const parsed =
      raw.trim()
        ? JSON.parse(raw)
        : {};

    return {
      ...clone(defaultData),
      ...parsed,

      users: {
        ...defaultData.users,
        ...(parsed.users || {}),
      },

      chats: {
        ...defaultData.chats,
        ...(parsed.chats || {}),
      },

      settings: {
        ...defaultData.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch (error) {
    console.error(
      chalk.red(
        'Database read error:'
      ),
      error
    );

    return clone(defaultData);
  }
}

let saveTimer = null;
let saveRunning = false;
let saveAgain = false;

async function saveDatabase() {
  if (saveRunning) {
    saveAgain = true;
    return;
  }

  saveRunning = true;

  try {
    const tmp =
      `${DATABASE_FILE}.tmp`;

    fs.writeFileSync(
      tmp,
      JSON.stringify(
        global.db.data,
        null,
        2
      )
    );

    fs.renameSync(
      tmp,
      DATABASE_FILE
    );
  } catch (error) {
    console.error(
      chalk.red(
        'Database save error:'
      ),
      error
    );
  } finally {
    saveRunning = false;

    if (saveAgain) {
      saveAgain = false;
      await saveDatabase();
    }
  }
}

function scheduleDatabaseSave() {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(
    () =>
      saveDatabase().catch(
        console.error
      ),
    1500
  );
}

global.db = {
  data: readDatabase(),
  save: scheduleDatabaseSave,
  write: saveDatabase,
};

global.loadDatabase =
  async () => {
    if (!global.db?.data) {
      global.db = {
        data: readDatabase(),
      };
    }

    if (!global.db.data) {
      global.db.data =
        readDatabase();
    }

    return global.db.data;
  };

/* =========================================================
 * PLUGIN SYSTEM
 * ========================================================= */

function normalizePlugin(
  module,
  file
) {
  const plugin =
    module?.default ||
    module;

  if (
    typeof plugin !== 'function' &&
    typeof plugin?.all !== 'function'
  ) {
    return null;
  }

  plugin.__filename = file;

  return plugin;
}

async function walkJavaScript(
  dir
) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  for (
    const entry of fs.readdirSync(
      dir,
      {
        withFileTypes: true,
      }
    )
  ) {
    if (
      entry.name.startsWith('.')
    ) {
      continue;
    }

    const full =
      path.join(
        dir,
        entry.name
      );

    if (entry.isDirectory()) {
      files.push(
        ...await walkJavaScript(
          full
        )
      );
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.js')
    ) {
      files.push(full);
    }
  }

  return files;
}

let pluginReloadTimer = null;

export async function loadPlugins() {
  const files =
    await walkJavaScript(
      PLUGIN_DIR
    );

  const next =
    Object.create(null);

  for (const file of files) {
    const relative =
      path
        .relative(
          PLUGIN_DIR,
          file
        )
        .split(path.sep)
        .join('/');

    try {
      const url =
        `${pathToFileURL(file).href}?update=${Date.now()}`;

      const module =
        await import(url);

      const plugin =
        normalizePlugin(
          module,
          file
        );

      if (!plugin) {
        console.warn(
          chalk.yellow(
            `Skipping invalid plugin: ${relative}`
          )
        );

        continue;
      }

      next[relative] =
        plugin;
    } catch (error) {
      console.error(
        chalk.red(
          `Failed to load plugin ${relative}`
        ),
        error
      );
    }
  }

  global.plugins = next;

  console.log(
    chalk.green(
      `Loaded ${Object.keys(next).length} plugins.`
    )
  );

  return next;
}

global.reloadHandler =
  async () => {
    await loadPlugins();
    return 'Plugins reloaded.';
  };

function watchPlugins() {
  const watchers =
    new Map();

  let reloadScheduled =
    false;

  const schedule = () => {
    if (reloadScheduled) {
      return;
    }

    reloadScheduled = true;

    clearTimeout(
      pluginReloadTimer
    );

    pluginReloadTimer =
      setTimeout(
        async () => {
          reloadScheduled =
            false;

          try {
            await loadPlugins();

            console.log(
              chalk.cyan(
                'Plugins reloaded.'
              )
            );
          } catch (error) {
            console.error(error);
          }
        },
        500
      );
  };

  const sync = async () => {
    const files =
      await walkJavaScript(
        PLUGIN_DIR
      );

    const current =
      new Set(files);

    for (
      const [file, watcher]
      of watchers
    ) {
      if (!current.has(file)) {
        watcher.close();
        watchers.delete(file);
        schedule();
      }
    }

    for (const file of files) {
      if (watchers.has(file)) {
        continue;
      }

      try {
        const watcher =
          fs.watch(
            file,
            schedule
          );

        watchers.set(
          file,
          watcher
        );
      } catch (error) {
        console.error(
          chalk.red(
            `Cannot watch plugin: ${file}`
          ),
          error
        );
      }
    }
  };

  sync().catch(
    console.error
  );

  return {
    sync,
  };
}

/* =========================================================
 * CONNECTION
 * ========================================================= */

let conn = null;
let stopping = false;
let reconnectTimer = null;

/*
 * Prevent shirokoku from being executed
 * more than once for the same socket.
 */
let shirokokuExecuted = false;

/* =========================================================
 * START CONNECTION
 * ========================================================= */

async function startConnection() {
  if (stopping) {
    return null;
  }

  clearTimeout(
    reconnectTimer
  );

  shirokokuExecuted =
    false;

  const auth =
    await useSQLite(
      SESSION_DIR
    );

  let version;

  try {
    const latest =
      await fetchLatestWaWebVersion();

    version =
      latest?.version;

    if (version) {
      console.log(
        chalk.gray(
          `WhatsApp Web version: ${version.join('.')}`
        )
      );
    }
  } catch {
    console.warn(
      chalk.yellow(
        'Could not fetch latest WhatsApp Web version, using Baileys default.'
      )
    );
  }

  const logger =
    pino({
      level:
        process.env.LOG_LEVEL ||
        'silent',
    });

  const connectionOptions = {
    auth: {
      creds:
        auth.state.creds,

      keys:
        makeCacheableSignalKeyStore(
          auth.state.keys,
          logger
        ),
    },

    logger,

    browser:
      Browsers.ubuntu(
        'Chrome'
      ),

    version,

    markOnlineOnConnect:
      true,

    generateHighQualityLinkPreview:
      true,

    syncFullHistory:
      true,

    shouldSyncHistoryMessage:
      () => true,

    connectTimeoutMs:
      60_000,

    keepAliveIntervalMs:
      30_000,

    retryRequestDelayMs:
      250,

    maxMsgRetryCount:
      5,

    cachedGroupMetadata:
      async (jid) =>
        conn?.chats?.[jid]
          ?.metadata,
  };

  /*
   * Create the socket.
   * This socket is passed to shirokoku
   * after connection === "open".
   */
  conn =
    makeWASocket(
      connectionOptions,
      {
        chats: {},

        packname:
          global.stickpack,

        packpublish:
          global.stickauth,
      }
    );

  global.conn = conn;

  global.conns =
    global.conns.filter(
      (item) =>
        item &&
        item !== conn
    );

  if (
    !global.conns.includes(
      conn
    )
  ) {
    global.conns.push(
      conn
    );
  }

  /*
   * Bind store to current socket.
   */
  try {
    store.bind(conn);
  } catch (error) {
    console.error(
      chalk.red(
        'Store bind error:'
      ),
      error
    );
  }

  /*
   * Save authentication credentials.
   */
  conn.ev.on(
    'creds.update',
    auth.saveCreds
  );

  /* =======================================================
   * HANDLER
   * ======================================================= */

  const {
    handler,
    participantsUpdate,
    groupsUpdate,
    deleteUpdate,
  } = await import(
    `./handler.js?update=${Date.now()}`
  );

  /*
   * Incoming messages.
   */
  conn.ev.on(
    'messages.upsert',
    async (update) => {
      try {
        await handler.call(
          conn,
          update
        );
      } catch (error) {
        console.error(
          chalk.red(
            'messages.upsert error:'
          ),
          error
        );
      }
    }
  );

  /*
   * Group participants.
   */
  conn.ev.on(
    'group-participants.update',
    async (update) => {
      try {
        await participantsUpdate.call(
          conn,
          update
        );
      } catch (error) {
        console.error(
          chalk.red(
            'group-participants.update error:'
          ),
          error
        );
      }
    }
  );

  /*
   * Group updates.
   */
  conn.ev.on(
    'groups.update',
    async (update) => {
      try {
        await groupsUpdate.call(
          conn,
          update
        );
      } catch (error) {
        console.error(
          chalk.red(
            'groups.update error:'
          ),
          error
        );
      }
    }
  );

  /*
   * Message updates / delete handler.
   */
  conn.ev.on(
    'messages.update',
    async (updates) => {
      for (
        const update of
        updates || []
      ) {
        try {
          await deleteUpdate.call(
            conn,
            update
          );
        } catch (error) {
          console.error(
            chalk.red(
              'messages.update error:'
            ),
            error
          );
        }
      }
    }
  );

  /* =======================================================
   * PAIRING CODE
   * ======================================================= */

  const pairingNumber =
    String(
      global.pairingNumber ||
      ''
    ).replace(
      /\D/g,
      ''
    );

  if (
    !auth.state.creds.registered &&
    pairingNumber.length >= 8 &&
    pairingNumber.length <= 15
  ) {
    setTimeout(
      async () => {
        /*
         * Don't request pairing if
         * the connection was already closed.
         */
        if (
          stopping ||
          !conn
        ) {
          return;
        }

        try {
          const code =
            await conn.requestPairingCode(
              pairingNumber
            );

          console.log(
            chalk.green(
              `Pairing code: ${code}`
            )
          );

          console.log(
            chalk.gray(
              `Pair ${pairingNumber} from WhatsApp > Linked devices.`
            )
          );
        } catch (error) {
          console.error(
            chalk.red(
              'Pairing code request failed:'
            ),
            error
          );
        }
      },
      3000
    );
  }

  /* =======================================================
   * CONNECTION UPDATE
   * ======================================================= */

  conn.ev.on(
    'connection.update',
    async (update) => {
      const {
        connection,
        lastDisconnect,
        qr,
      } = update;

      if (qr) {
        console.log(
          chalk.yellow(
            'QR received. Scan it with WhatsApp if QR login is enabled.'
          )
        );
      }

      if (
        connection ===
        'connecting'
      ) {
        console.log(
          chalk.cyan(
            'Connecting to WhatsApp...'
          )
        );
      }

      /* ===================================================
       * SOCKET OPEN
       *
       * Shirokoku MUST be called here.
       * =================================================== */

      if (
        connection ===
        'open'
      ) {
        const jid =
          conn.user?.id ||
          conn.user?.jid ||
          '';

        console.log(
          chalk.green(
            `Connected: ${jid}`
          )
        );

        /*
         * Initialize bot settings.
         */
        const botJid =
          conn.decodeJid?.(
            jid
          ) || jid;

        global.db.data.settings[
          botJid
        ] = {
          prefix:
            global.db.data.settings[
              botJid
            ]?.prefix ?? '',

          public: true,

          autoread: true,

          anticall: true,

          gconly: false,

          ...global.db.data.settings[
            botJid
          ],
        };

        scheduleDatabaseSave();

        /* ================================================
         * SHIROKOKU
         * ================================================ */

        if (
          !shirokokuExecuted
        ) {
          shirokokuExecuted =
            true;

          try {
            console.log(
              chalk.cyan(
                'Running shirokoku...'
              )
            );

            const success =
              await shirokoku(
                conn
              );

            if (success === true) {
              console.log(
                chalk.green(
                  'Shirokoku: success'
                )
              );
            } else {
              console.warn(
                chalk.yellow(
                  'Shirokoku: failed'
                )
              );
            }
          } catch (error) {
            /*
             * Shirokoku failure should not
             * crash the WhatsApp bot.
             */
            console.error(
              chalk.red(
                'Shirokoku error:'
              ),
              error
            );
          }
        }
      }

      /* ===================================================
       * CONNECTION CLOSED
       * =================================================== */

      if (
        connection ===
        'close'
      ) {
        const statusCode =
          lastDisconnect
            ?.error
            ?.output
            ?.statusCode;

        const loggedOut =
          statusCode ===
          DisconnectReason.loggedOut;

        const replaced =
          statusCode ===
          DisconnectReason.connectionReplaced;

        console.error(
          chalk.red(
            `Connection closed${
              statusCode
                ? ` (${statusCode})`
                : ''
            }.`
          )
        );

        /*
         * Session cannot be reused.
         */
        if (
          loggedOut ||
          replaced
        ) {
          console.error(
            chalk.yellow(
              'Session is no longer reusable. Re-authentication is required.'
            )
          );

          return;
        }

        /*
         * Reconnect automatically.
         */
        if (!stopping) {
          clearTimeout(
            reconnectTimer
          );

          reconnectTimer =
            setTimeout(
              () => {
                startConnection()
                  .catch(
                    (error) => {
                      console.error(
                        chalk.red(
                          'Reconnect failed:'
                        ),
                        error
                      );
                    }
                  );
              },
              5000
            );
        }
      }
    }
  );

  return conn;
}

/* =========================================================
 * SHUTDOWN
 * ========================================================= */

async function shutdown(
  signal
) {
  if (stopping) {
    return;
  }

  stopping = true;

  console.log(
    chalk.yellow(
      `\n${signal}: shutting down...`
    )
  );

  clearTimeout(
    reconnectTimer
  );

  clearTimeout(
    saveTimer
  );

  try {
    await saveDatabase();
  } catch (error) {
    console.error(error);
  }

  try {
    conn?.end?.(
      undefined
    );
  } catch {}

  process.exit(0);
}

/* =========================================================
 * PROCESS EVENTS
 * ========================================================= */

process.on(
  'SIGINT',
  () =>
    shutdown('SIGINT')
);

process.on(
  'SIGTERM',
  () =>
    shutdown('SIGTERM')
);

process.on(
  'unhandledRejection',
  (error) => {
    console.error(
      chalk.red(
        'Unhandled rejection:'
      ),
      error
    );
  }
);

process.on(
  'uncaughtException',
  (error) => {
    console.error(
      chalk.red(
        'Uncaught exception:'
      ),
      error
    );
  }
);

/* =========================================================
 * MAIN
 * ========================================================= */

async function main() {
  console.log(
    chalk.bold.cyan(
      'Starting Ambatukam Multi-Device...'
    )
  );

  console.log(
    chalk.gray(
      `Node.js ${process.version}`
    )
  );

  console.log(
    chalk.gray(
      `Session: ${SESSION_DIR}`
    )
  );

  /*
   * Load database first.
   */
  await global.loadDatabase();

  /*
   * Optional database module initialization.
   * Kept compatible with bases where database.js
   * exports an initialization function.
   */
  try {
    if (
      typeof databaseHandler ===
      'function'
    ) {
      await databaseHandler(
        global.db
      );
    } else if (
      typeof databaseHandler?.init ===
      'function'
    ) {
      await databaseHandler.init(
        global.db
      );
    }
  } catch (error) {
    console.warn(
      chalk.yellow(
        'Database handler initialization warning:'
      ),
      error
    );
  }

  /*
   * Load plugins.
   */
  await loadPlugins();

  /*
   * Watch plugin changes.
   */
  watchPlugins();

  /*
   * Start WhatsApp.
   */
  await startConnection();

  /*
   * Periodic database save.
   */
  setInterval(
    () =>
      saveDatabase().catch(
        console.error
      ),
    30_000
  ).unref();

  /* =======================================================
   * CLI
   * ======================================================= */

  const rl =
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

  rl.on(
    'line',
    async (line) => {
      const command =
        line
          .trim()
          .toLowerCase();

      if (!command) {
        return;
      }

      /* -----------------------------------------------
       * RESTART
       * ----------------------------------------------- */

      if (
        command === 'restart' ||
        command === 'reset'
      ) {
        console.log(
          chalk.yellow(
            'Restarting connection...'
          )
        );

        try {
          conn?.end?.(
            undefined
          );
        } catch {}

        await startConnection();

        return;
      }

      /* -----------------------------------------------
       * RELOAD PLUGINS
       * ----------------------------------------------- */

      if (
        command === 'reload' ||
        command ===
          'reloadplugins'
      ) {
        await loadPlugins();

        return;
      }

      /* -----------------------------------------------
       * SAVE DATABASE
       * ----------------------------------------------- */

      if (
        command === 'save'
      ) {
        await saveDatabase();

        console.log(
          chalk.green(
            'Database saved.'
          )
        );

        return;
      }

      /* -----------------------------------------------
       * EXIT
       * ----------------------------------------------- */

      if (
        command === 'exit' ||
        command === 'stop'
      ) {
        await shutdown(
          'CLI'
        );

        return;
      }

      /*
       * Custom plugin command event.
       */
      if (conn) {
        try {
          conn.ev.emit(
            'main.command',
            command
          );
        } catch {}
      }
    }
  );
}

/* =========================================================
 * BOOT
 * ========================================================= */

main().catch(
  (error) => {
    console.error(
      chalk.red(
        'Fatal startup error:'
      ),
      error
    );

    process.exitCode = 1;
  }
);