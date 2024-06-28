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

async function storeHashes(name, image1Hash, image2Hash, pdfHash) {
  if (window.localStorage.getItem("walletAddress") !== null) {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const address = window.localStorage.getItem("walletAddress");
    try {
      await contract.methods
        .createImage(name, image1Hash, image2Hash, pdfHash)
        .send({ from: address });
      console.log("Hashes stored successfully");
    } catch (error) {
      console.error("Error storing hashes:", error);
    }
  }
}
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMjAxODU0ZS1lZjZlLTQ3ZWItYTI4Mi1mOWMxOWJmY2JmMGIiLCJlbWFpbCI6InNhdHdpay5nb3lhbC4yNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODY1MmI4NTlmMjcwYjkwNTIyYzkiLCJzY29wZWRLZXlTZWNyZXQiOiI1MzEwMTBkNTk5M2Y2M2YwZGE3Njg3MWQ0MTU4ZDQyZmI5ODBlODgxMzgwYTNjZWI1MDc0NjBmMDhiYWM5MjM3IiwiaWF0IjoxNzAxMDgzMzU3fQ.LpJnmfnzEBOAiNLSESk0V8as9WijfZTqf2JOJjtR-IY";

const pinFileToIPFS = async (file, name) => {
  const formData = new FormData();
  formData.append("file", file);
  const pinataMetadata = JSON.stringify({
    name: name,
  });
  formData.append("pinataMetadata", pinataMetadata);
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const pinJsonToIPFS = async (jsonObject) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  try {
    const res = await axios.post(url, jsonObject, {
      maxBodyLength: "Infinity",
      headers: {
        Authorization: JWT,
      },
    });
    return res.data.IpfsHash;
  } catch (error) {
    console.error(error);
    return null;
  }
};

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const image1 = document.getElementById("image1").files[0];
  const image2 = document.getElementById("image2").files[0];
  const pdf = document.getElementById("pdf").files[0];

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Uploading files to IPFS...";

  try {
    const image1Hash = await pinFileToIPFS(image1, "image1");
    const image2Hash = await pinFileToIPFS(image2, "image2");
    const pdfHash = await pinFileToIPFS(pdf, "pdf");

    const metadata = {
      name: name,
      image1: image1Hash,
      image2: image2Hash,
      pdf: pdfHash,
    };

    const metadataHash = await pinJsonToIPFS(metadata);

    const beforeImage = "https://gateway.pinata.cloud/ipfs/" + image1Hash;
    const afterImage = "https://gateway.pinata.cloud/ipfs/" + image2Hash;
    const pdfFileHash = "https://gateway.pinata.cloud/ipfs/" + pdfHash;

    const storeImage = await storeHashes(
      name,
      beforeImage,
      afterImage,
      pdfFileHash
    );
    console.log("hjs;flihasopdfuhaspiofhaips9ufhaso");

    resultDiv.innerHTML = `
            <p>Files uploaded successfully!</p>
            <p>Image 1 Hash: ${image1Hash}</p>
            <p>Image 2 Hash: ${image2Hash}</p>
            <p>PDF Hash: ${pdfHash}</p>
            <p>Metadata Hash: ${metadataHash}</p>
        `;
  } catch (error) {
    resultDiv.innerHTML = `Error: ${error.message}`;
  }
});
