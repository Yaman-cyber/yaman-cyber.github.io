function fence(source, text) {
  return "<untrusted source=\"" + source + "\">\n" + text.replaceAll("</untrusted", "") + "\n</untrusted>";
}
module.exports = { fence };
