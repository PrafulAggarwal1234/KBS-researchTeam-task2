//Praful Aggarwal 21AE10030
//Soltuion of Task 2 research team KBS


//Build a Blockchain with JavaScript.


const {createHash} = require('crypto');
function hash(string) {
    return createHash('sha256').update(string).digest('hex');
  }

 // transaction structure to represent the data that will be stored in each block. 
class Transactions{
    constructor(fromAdress,toAdress,amount){

        this.fromAdress=fromAdress;
        this.toAdress=toAdress;
        this.amount=amount;
    }
  }


///1.  Blockchain Structure:

class Block{
    constructor(index,timestamp,transactions,previousHash=''){
        this.index=index;
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }
       
    //hashing algorithm
    calculateHash(){
        return hash(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }

    // Proof of Work (PoW) algortihm to make sure blocks are only regarded as valid if they require a certain amount of computational power to produce
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!= Array(difficulty+1).join("0") ){
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty=4;  //difficulty of pow algorithm
        this.pendingTransactions = [];
        this.miningReward=100; //miner's reward
        this.transactionFees=10; //transaction fees
        this.index=1;
    }
    //First block on block is called Genesis
    createGenesisBlock(){
        return new Block(0,"13/05/2023","Genesis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    miniPendingTransactions(miningRewardAddress){
        let block = new Block(this.index++,Date.now(),this.pendingTransactions);
        console.log("block: "+block);
        block.mineBlock(this.difficulty);
        block.previousHash=this.chain[this.chain.length-1].hash;
        console.log("Block is successfully mined");
        this.chain.push(block);
        
        //giving minner his reward and reseting the pendingtranstion array
        this.pendingTransactions=[
            new Transactions(null,miningRewardAddress,this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance=0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                //if it is sender the subtract the amount tranfered + transiction fees because this is what he'll have to pay (we are assuming miner is getting coins from somewhere else for simplicity altough in real crypto sender will also have to minging fuel or gas)
                if(trans.fromAdress === address) balance-=(trans.amount + this.transactionFees);
                if(trans.toAdress === address) balance+=trans.amount;
            }
        }
        return balance;
    }
    //function to check if chain is valid
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if((currBlock.hash !== currBlock.calculateHash()) || currBlock.previousHash !== prevBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let kgpCoin = new Blockchain(); //creating new blockchain named kgpCoin
kgpCoin.createTransaction(new Transactions('address1','address2',1000));
kgpCoin.createTransaction(new Transactions('address2','address1',500));
// console.log(kgpCoin);
console.log("Strating the miner....\n");
kgpCoin.miniPendingTransactions('miner-address');
console.log(kgpCoin.getBalanceOfAddress('miner-address'));
console.log(kgpCoin.getBalanceOfAddress('address1'));
console.log(kgpCoin.getBalanceOfAddress('address2'));
kgpCoin.miniPendingTransactions('miner2-address');
console.log(kgpCoin.getBalanceOfAddress('miner-address'));

console.log(kgpCoin);