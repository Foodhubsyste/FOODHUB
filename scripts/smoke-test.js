const baseUrl = String(process.env.BASE_URL || "").replace(/\/$/, "");
const username = process.env.SMOKE_ADMIN_USERNAME || process.env.ADMIN_USERNAME;
const password = process.env.SMOKE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!baseUrl) {
  console.error("BASE_URL is required. Example: BASE_URL=https://your-app.example.com npm run smoke");
  process.exit(1);
}

if (!username || !password) {
  console.error("SMOKE_ADMIN_USERNAME and SMOKE_ADMIN_PASSWORD are required.");
  process.exit(1);
}

async function request(path, options = {}) {
  const response = await fetch(baseUrl + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  let body = null;
  try {
    body = await response.json();
  } catch (_) {}

  return { response, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function uniqueName() {
  return "Smoke Test Item " + Date.now();
}

async function main() {
  console.log("FOODHUB smoke test:", baseUrl);

  const health = await request("/api/health");
  assert(health.response.ok && health.body?.data?.service === "FOODHUB", "Health check failed.");
  console.log("PASS health");

  const login = await request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
  assert(login.response.ok && login.body?.data?.token, "Admin login failed.");
  const token = login.body.data.token;
  console.log("PASS admin login");

  const authHeaders = { Authorization: "Bearer " + token };

  const protectedBefore = await request("/api/customers");
  assert(protectedBefore.response.status === 401, "Protected customer endpoint did not reject anonymous access.");
  console.log("PASS anonymous protection");

  const menu = await request("/api/menu");
  assert(menu.response.ok && Array.isArray(menu.body?.data), "Menu read failed.");
  console.log("PASS menu read");

  const invalid = await request("/api/menu", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "",
      category: "Smoke",
      price: 50,
      stock_quantity: 1,
      status: "available"
    })
  });
  assert(invalid.response.status === 422, "Invalid menu submission did not return 422.");
  console.log("PASS 422 validation");

  const name = uniqueName();
  const create = await request("/api/menu", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name,
      description: "Temporary automated smoke-test item",
      category: "Smoke Test",
      price: 1,
      stock_quantity: 1,
      status: "available"
    })
  });
  assert(create.response.status === 201 && create.body?.data?.id, "Menu create failed.");
  const id = create.body.data.id;
  console.log("PASS menu create:", id);

  const show = await request("/api/menu/" + encodeURIComponent(id));
  assert(show.response.ok && show.body?.data?.id === id, "Menu detail/read-after-create failed.");
  console.log("PASS menu detail");

  const update = await request("/api/menu/" + encodeURIComponent(id), {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      name,
      description: "Updated smoke-test item",
      category: "Smoke Test",
      price: 2,
      stock_quantity: 2,
      status: "available"
    })
  });
  assert(update.response.ok && update.body?.data?.price === 2, "Menu update failed.");
  console.log("PASS menu update");

  const remove = await request("/api/menu/" + encodeURIComponent(id), {
    method: "DELETE",
    headers: authHeaders
  });
  assert(remove.response.ok, "Menu delete failed.");
  console.log("PASS menu delete");

  const afterDelete = await request("/api/menu/" + encodeURIComponent(id));
  assert(afterDelete.response.status === 404, "Deleted menu item did not return 404.");
  console.log("PASS deleted-record 404");

  console.log("FOODHUB smoke test completed successfully.");
}

main().catch(error => {
  console.error("SMOKE TEST FAILED:", error.message);
  process.exit(1);
});
