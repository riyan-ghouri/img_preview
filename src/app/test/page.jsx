import React from "react";
import ApiTester from "../components/ApiTester";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <ApiTester />
      </div>
    </div>
  );
};

export default Page;
