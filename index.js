import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("FundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethamount").value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        //provider /connection to the blockchain
        //signer /wallet / someone with some gas
        //contract we're interacting with
        //^ ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum) // looks into our metamask to find the http endpoint
        const signer = provider.getSigner() // return whichever wallet is connected from our provider (which is metamask here)
        const contract = new ethers.Contract(contractAddress, abi, signer) //?

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTreansactionMine(transactionResponse, provider)
            console.log("Done!")
            //listen for the tx to be mined
            //listen for an event
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTreansactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

//Withdraw
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() // return whichever wallet is connected from our provider (which is metamask here)
        const contract = new ethers.Contract(contractAddress, abi, signer) //?
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTreansactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
