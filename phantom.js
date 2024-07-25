document
  .getElementById("connectButton")
  .addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const isPhantomInstalled = window.solana && window.solana.isPhantom;

    if (!isPhantomInstalled) {
      alert("Phantom Wallet is not installed");
      return;
    }

    if (window.solana.isConnected) {
      // Disconnect the wallet
      window.solana.disconnect();
      document.getElementById("connectButton").textContent = "Connect Wallet";
      document.getElementById("walletAddress").textContent = "";
      document.getElementById("tokenBalances").textContent = "";
      document.getElementById("spinbtn").style.display = "none"; // Hide the spin button
    } else {
      // Connect to Phantom Wallet
      try {
        const resp = await window.solana.connect();
        const walletAddress = resp.publicKey.toString();
        document.getElementById("walletAddress").textContent = walletAddress;
        document.getElementById("connectButton").textContent =
          "Disconnect Wallet";

        // Fetch token balances
        await fetchTokenBalances(walletAddress);
      } catch (err) {
        console.error("Error connecting to Phantom Wallet", err);
      }
    }
  });

async function fetchTokenBalances(walletAddress) {
  const alchemyApiKey = "3NfQ3MFPqhGdKfIID0Tp1Ig8_6S9irMN";
  const connection = new solanaWeb3.Connection(
    `https://solana-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
  );
  const publicKey = new solanaWeb3.PublicKey(walletAddress);

  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new solanaWeb3.PublicKey(
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        ),
      }
    );

    const tokenAddressesToCheck = [
      "4aBbiwHuh8aB9oUozAHKgdyBsa8FQnxTorgLdYdFGAAJ",
    ]; // Add the token addresses you want to check

    const balancesList = document.getElementById("tokenBalances");
    balancesList.innerHTML = "";

    let canSpin = false; // Flag to determine if the user can spin

    tokenAddressesToCheck.forEach((tokenAddress) => {
      const accountInfo = tokenAccounts.value.find(
        (account) => account.account.data.parsed.info.mint === tokenAddress
      );

      if (accountInfo) {
        const tokenAmount =
          accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
        const listItem = document.createElement("li");
        listItem.textContent = `Token Address: ${tokenAddress}, Balance: ${tokenAmount}`;
        balancesList.appendChild(listItem);

        if (tokenAmount >= 15 ) {
          canSpin = true;
          const spinButton = document.createElement("button");
          spinButton.textContent = "Spin the Wheel";
          spinButton.className = "spin-btn";
          spinButton.onclick = () => window.location.href = 'wheel.html';
          listItem.appendChild(spinButton);
        } else {
          const listItem = document.createElement("li");
          listItem.textContent = `Not enough token balance, Buy Now`;
          balancesList.appendChild(listItem);
        }
      } else {
        const listItem = document.createElement("li");
        listItem.textContent = `Token Address: ${tokenAddress}, Buy Now`;
        balancesList.appendChild(listItem);
      }
    });

    // Show spin button only if email is valid and token balance is sufficient
    if (canSpin && isValidEmail(document.getElementById("emailInput").value)) {
      document.getElementById("spinbtn").style.display = "block";
    } else {
      document.getElementById("spinbtn").style.display = "none";
    }
  } catch (err) {
    console.error("Error fetching token balances", err);
  }
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

document.getElementById("emailInput").addEventListener("input", () => {
  // Show spin button only if email is valid and token balance is sufficient
  if (isValidEmail(document.getElementById("emailInput").value)) {
    document.getElementById("spinbtn").style.display = "block";
  } else {
    document.getElementById("spinbtn").style.display = "none";
  }
});
