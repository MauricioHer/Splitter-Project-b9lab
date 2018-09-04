const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter',accounts =>{console.log(accounts);
	let spli;
	var alice = accounts[0];
	var bob = accounts[1];
	var carol = accounts[2];
	

	beforeEach('set up contract',async function(){
	spli = await Splitter.new({from:accounts[0], value:10000000000000000})
	});

	it("should be owner by creator",async function(){
	assert.equal(await spli.owner(), alice)	
	});
	
	it("contract balance should be the amount send from owner", async function(){
	let balance = await spli.contractBalance();
	assert.equal(balance.valueOf(),10000000000000000,"there wasn't 10000 in the contract")});

	it("should set the participants",async function(){
	let participant = await spli.setReceivers(bob,carol);
	assert.equal(await spli.addressKeeper.call(0),alice,"wrong");
	assert.equal(await spli.addressKeeper.call(1),bob,"wrong");
	assert.equal(await spli.addressKeeper.call(2),carol,"wrong");
	});

	it("should set bobPending & carolPending True",async function(){
	await spli.setReceivers(bob,carol);
	assert.equal(await spli.bobPending(),true);
	assert.equal(await spli.carolPending(),true)});
	
	it("should allow to withdraw ether to bob",async function(){
	 const BobBalanceBefore=web3.eth.getBalance(accounts[1]).toNumber();
	 await spli.setReceivers(bob,carol);
	 await spli.withDrawOne({from: bob});
	assert.equal(web3.eth.getBalance(spli.address).toNumber(),5000000000000000);
	assert.equal(await spli.bobPending(),false);
	assert.isAbove(web3.eth.getBalance(bob).toNumber(),BobBalanceBefore)});
	
	it("should allow to withdraw ether to carol",async function(){
	 const CarolBalanceBefore=web3.eth.getBalance(accounts[2]).toNumber();
	 await spli.setReceivers(bob,carol);
	 await spli.withDrawTwo({from: carol});
	assert.equal(web3.eth.getBalance(spli.address).toNumber(),5000000000000000);
	assert.equal(await spli.carolPending(),false);
	assert.isAbove(web3.eth.getBalance(carol).toNumber(),CarolBalanceBefore)});
	
	it("if both have withdraw ether the contract Balance should be 0", async function(){
	await spli.setReceivers(bob,carol);
	await spli.withDrawOne({from: bob});
	await spli.withDrawTwo({from: carol});
	assert.equal( await spli.bobPending(),false);
	assert.equal( await spli.carolPending(),false);
	assert.equal(web3.eth.getBalance(spli.address).toNumber(),0);	
	});
				
	it("no one else but the authorized can withDraw", async function(){
		await spli.setReceivers(bob,carol)
		try{
		await spli.withDrawOne({from:accounts[0]})}
		catch(error){
		return true;}
		throw new Error("I should never see this")});
		
	/*it("no one else but the authorized can withDraw", async function(){
	await spli.setReceivers(bob,carol)	
	try{
	await spli.withDrawOne({from:accounts[0]})
	assert.fail()
	}catch(error){
	assert(error.toString().includes('invalid opcode'), error.toString())
	}		
	assert.equal(web3.eth.getBalance(spli.address).toNumber(),1000000000000000);
	});	

	*/




})
