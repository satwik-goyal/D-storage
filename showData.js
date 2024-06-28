const contractABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_beforeImageHash", type: "string" },
      { internalType: "string", name: "_afterImageHash", type: "string" },
      { internalType: "string", name: "_pdfImageHash", type: "string" },
    ],
    name: "createImage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "getOnwerIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_imageId", type: "uint256" }],
    name: "retrieveImage",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint256", name: "number", type: "uint256" },
          { internalType: "string", name: "beforeImageHash", type: "string" },
          { internalType: "string", name: "afterImageHash", type: "string" },
          { internalType: "string", name: "pdfImageHash", type: "string" },
        ],
        internalType: "struct IPFS.Image",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contractAddress = "0x1176a5bD10680a69049Aeb8B6a6Aed1413a95733";

document.addEventListener("DOMContentLoaded", () => {
  const fetchDataForm = document.getElementById("fetchDataForm");
  const dataResult = document.getElementById("dataResult");

  fetchDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataID = document.getElementById("dataID").value;
    await fetchDataByID(dataID);
  });

  async function fetchDataByID(id) {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log(contract);
    try {
      const data = await contract.methods.retrieveImage(id).call(); // Replace with your actual method name
      console.log(data);
      dataResult.innerHTML = `
        <p>Before Image: <img src="${data.beforeImageHash}" alt="Before Image" /></p>
        <p>After Image: <img src="${data.afterImageHash}" alt="After Image" /></p>
        <p>PDF: <a href="${data.pdfImageHash}" target="_blank">View PDF</a></p>
      `;
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      dataResult.textContent = "Error fetching data";
    }
  }
});
