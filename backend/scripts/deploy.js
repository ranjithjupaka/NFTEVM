async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("ZkSeaNFT");
  const feeData = await ethers.provider.getFeeData();
  console.log(feeData);
  const token = await Token.deploy("PepeSuperGrowNFT","PEPEGNFT","0x6290f358757f0199491a030E9948098E06E75cd6","0x6290f358757f0199491a030E9948098E06E75cd6"
  );

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
