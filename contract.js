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
    inputs: [],
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
const contractAddress = "0x5fBcbED53fD2A1e12b7fA7FB3CAfaFBb68B2e2c8";

async function storeHashes(name, image1Hash, image2Hash, pdfHash) {
  if (window.localStorage.getItem("currentAddr") !== null) {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const address = window.localStorage.getItem("walletAddress");
    try {
      await contract.methods
        .createImage(name, image1Hash, image2Hash, pdfHash)
        .send({ from: account });
      console.log("Hashes stored successfully");
    } catch (error) {
      console.error("Error storing hashes:", error);
    }
  }
}

// Export the storeHashes function for use in other files
export { storeHashes };
