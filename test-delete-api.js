// Simple test script to verify the delete API endpoint
// This is just for testing the basic functionality

async function testDeleteAPI() {
  console.log("Testing delete API endpoint...");

  try {
    // Test with an invalid ID
    const response1 = await fetch("http://localhost:3000/api/cafe/999", {
      method: "DELETE",
    });

    console.log("Test 1 - Invalid ID (999):", response1.status, response1.statusText);
    const data1 = await response1.json();
    console.log("Response:", data1);

    // Test with a non-numeric ID
    const response2 = await fetch("http://localhost:3000/api/cafe/abc", {
      method: "DELETE",
    });

    console.log("Test 2 - Non-numeric ID (abc):", response2.status, response2.statusText);
    const data2 = await response2.json();
    console.log("Response:", data2);

    // Test with a valid numeric ID (should fail due to no auth)
    const response3 = await fetch("http://localhost:3000/api/cafe/1", {
      method: "DELETE",
    });

    console.log("Test 3 - Valid ID (1) without auth:", response3.status, response3.statusText);
    const data3 = await response3.json();
    console.log("Response:", data3);
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testDeleteAPI();

