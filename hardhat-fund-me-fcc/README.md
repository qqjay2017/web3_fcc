# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## 编译

```
yarn hardhat compile
```

## 部署命令

```
yarn hardhat deploy --network goerli
```

```
yarn add @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers
```

1333413205320000000000 getPrice
13334132053200000000000 getConversionRate(10eth)
100000000000000000 MINIMUM_USD

## 单元测试

```
yarn hardhat test --grep "funder to array"

```

#### staging 测试

```
 yarn hardhat test  --network goerli
```

## LOCALHOST network

```
 yarn hardhat node

yarn hardhat run scripts/withdraw.ts --network localhost
```

第一次提交
