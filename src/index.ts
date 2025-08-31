export default {
  async fetch(req) {
    // 静态资源会优先由 assets 处理
    return new Response("Not Found", { status: 404 });
  }
} satisfies ExportedHandler;