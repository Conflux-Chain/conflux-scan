import React, { Component } from 'react';

class Faqs extends Component {
  render() {
    return (
      <div className="conflux">
        <div className="row title">Conflux Q＆A</div>
        <div className="FAQs_content">
          <div className="FAQs">
            <h3>1. What is Conflux?</h3>
            <p>
              Conflux is a next-generation blockchain system with a novel consensus protocol, powering highly-scalable cryptocurrency and
              smart contract.
            </p>
            <p>
              Blockchain systems face serious challenges in scalability, security, and extensibility before they could be widely adopted for
              real-world applications. Bitcoin/Ethereum can only process 7 - 15 transactions per second, far below the throughput
              requirement of many applications. Smart contracts deployed in Ethereum often contain irrecoverable bugs leading to
              millions-of-dollar losses. Conflux is going to improve the blockchain system with its novel consensus algorithm, and to build
              scalable, secure, and extensible blockchain platform for future decentralized blockchain applications (DApps).
            </p>
          </div>
          <div className="FAQs">
            <h3>2. What is the technical advantage of Conflux?</h3>
            <p>
              Conflux unleashes the potential of blockchain consensus protocol to break the current scalability limitation exhibited in
              existing alternative systems, like Bitcoin and Ethereum, and provides the strong security guarantee at the same time. The key
              enabler technique is a novel DAG-based ledger structure together with an optimistic concurrency control to achieve a
              consistent order of transactions among all the nodes in the network. In Conflux, the throughput bottleneck is no longer at
              consensus layer. In addition, unlike the other scalability solutions such as DPOS and hybrid consensus, Conflux consensus
              algorithm is fully decentralized and permissionless without any hierarchy. Please see more details in our paper:
              https://arxiv.org/abs/1805.03870.
            </p>
          </div>
          <div className="FAQs">
            <h3>3. What does TPS mean? Why do we need high TPS? What is the TPS of Visa?</h3>
            <p>
              TPS refers to transactions per second. It is a measurement on the throughput of information processing system which
              continuously manipulates and processes business transaction data. This metric is important to such systems whose targeting
              scenarios are performance-critical.
            </p>
            <p>
              We need high TPS because the key applications, like payment, livestream, and instant messages, etc., require the system to
              process large number of transactions per second, since there are lots of data to process. If we want to build these
              applications on blockchain, we have to make sure the main net has the scalability to achieve the targeting TPS. For example,
              we cannot pay Bitcoin for a coffee because the TPS of Bitcoin is too small, which makes the transaction extremely slow and
              expensive. We have to wait for an hour to confirm the transaction. Payment transaction is already a simple process that does
              not require very high TPS, therefore, it is impossible for Bitcoin or even Ethereum to have any other more complicated
              applications built on it.{' '}
            </p>
            <p>
              The centralized service like Visa processes TPS at about 3000. Conflux has already reached 3000 TPS on 20Mbps bandwidth limit
              and 6000 TPS on 40Mbps bandwidth limit, which means that Conflux can already handle transactions at Visa level. However, in a
              decentralized blockchain system, transactions need to be confirmed by the whole network, which will take longer time to
              complete the comfirmations. In Conflux, we can confirm transactions in about 10 minutes even at over 3000 TPS on average,
              which is already a huge improvement compared to Bitcoin and Ethereum.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default Faqs;
