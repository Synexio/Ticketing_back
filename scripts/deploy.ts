import { ethers, upgrades, network } from 'hardhat';

async function main() {
  // Deploy proxy contract
  const Ticketing = (await ethers.getContractFactory('Ticketing'));
  console.log("Deploying Ticketing.sol proxy to", network.name);
  const ticketing = await upgrades.deployProxy(Ticketing, [10, 1, process.env.PUBLIC_KEY], { initializer: "initialize" });
  await ticketing.waitForDeployment();

  console.log('Ticketing.sol deployed to:', ticketing.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });