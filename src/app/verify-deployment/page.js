
export default function TestPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-blue-600">Deployment Verification Page</h1>
      <p className="mt-4">If you can see this, the deployment is updating successfully.</p>
      <p className="mt-2 text-sm text-gray-500">Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
