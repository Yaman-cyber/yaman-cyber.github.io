// good vs bad tool design
// Bad: one tool that can do anything
server.registerTool("run_sql", /* ... */);

// Good: small, specific, read-only
server.registerTool("search_docs", /* ... */);
server.registerTool("get_order_status", /* takes an order id, returns its status */);
