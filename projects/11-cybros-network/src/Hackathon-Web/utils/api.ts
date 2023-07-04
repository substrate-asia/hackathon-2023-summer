
async function getStatusData() {
  try {
    const data =  await fetch("https://demo-api.cybros.network/status");
    return data.json();
  } catch (error) {
    return { error: "falied" };
  }
}

async function getAIGCCardData(id: number) {
  try {
    const data =  await fetch(`https://demo-api.cybros.network/job/${id}`);
    return data.json();
  } catch (error) {
    return { error: "falied" };
  }
}

export {
  getStatusData,
  getAIGCCardData,
};