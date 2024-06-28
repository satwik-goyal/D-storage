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
  const statusText = document.getElementById("status");
  const ownedIDsList = document.getElementById("ownedIDs");

  // Check if MetaMask is installed
  if (typeof window.ethereum !== "undefined") {
    const web3 = new Web3(window.ethereum);

    // Listen for account changes
    window.ethereum.on("accountsChanged", async (accounts) => {
      handleAccountsChanged(accounts);
    });

    // If already connected, display the current address and owned IDs
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      statusText.textContent = `Connected: ${storedAddress}`;
      displayOwnedIDs(storedAddress);
    }
  } else {
    console.error("MetaMask not detected");
    statusText.textContent = "Please install MetaMask";
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log(
        "MetaMask is locked or the user has not connected any accounts"
      );
      statusText.textContent = "Please connect to MetaMask";
      localStorage.removeItem("walletAddress");
      ownedIDsList.innerHTML = "";
    } else {
      const address = accounts[0];
      localStorage.setItem("walletAddress", address);
      statusText.textContent = `Connected: ${address}`;
      displayOwnedIDs(address);
      console.log("Address updated in local storage:", address);
    }
  }

  async function displayOwnedIDs(address) {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
      const ownedIDs = await contract.methods.getOnwerIds(address).call();
      console.log(ownedIDs);
      ownedIDsList.innerHTML = "";
      ownedIDs.forEach((id) => {
        const li = document.createElement("li");
        li.textContent = id;
        ownedIDsList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching owned IDs:", error);
    }
  }
});
