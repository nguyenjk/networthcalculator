export default async function handler(req, res) {
  // calling backend to calculate.
  const result = await fetch(`http://localhost:3001/networth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: req.body
  });

  console.log('api: ' , result)
  res.status(200).json(result);
}
