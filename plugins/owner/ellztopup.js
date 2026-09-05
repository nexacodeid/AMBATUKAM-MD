const handler = async () => {}

handler.help = [
  'addproduk <nama|harga|stok>',
  'delproduk <nama/nomor>',
  'setstok <nama/nomor|jumlah>',
  'tambahstok <nama/nomor|jumlah>',
  'kurangstok <nama/nomor|jumlah>',
  'setharga <nama/nomor|harga>',
  'additem <nama/nomor|data produk>',
  'additem <nama/nomor> reply gambar/video/file',
  'listitem <nama/nomor>',
  'addvoucher <kode|nilai|percent/flat|limit>',
  'delvoucher <kode>',
  'setvoucher <kode|on/off>',
  'alltrx',
  'trxuser <nomor>',
  'omset hari/bulan/semua',
  'listremindstok'
]
handler.tags = ['owner']
handler.command = /^ellztopup$/i
handler.owner = true
handler.private = true

export default handler
