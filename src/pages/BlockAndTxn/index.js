import React from 'react';
import { Card, Feed } from 'semantic-ui-react';
import styled from 'styled-components';
import DataList from '../../components/DataList';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledTabel = styled.div`
  margin-top: 20px;
  width: calc(50% - 6px);

  &.left {
    float: left;
  }
  &.right {
    float: right;
  }
`;

const CardExampleContentBlock = () => (
  <Card>
    <Card.Content>
      <Card.Header>Recent Activity</Card.Header>
    </Card.Content>
    <Card.Content>
      <Feed>
        <Feed.Event>
          <Feed.Label image="/images/avatar/small/jenny.jpg" />
          <Feed.Content>
            <Feed.Date content="1 day ago" />
            <Feed.Summary>
              You added <a>Jenny Hess</a> to your <a>coworker</a> group.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>

        <Feed.Event>
          <Feed.Label image="/images/avatar/small/molly.png" />
          <Feed.Content>
            <Feed.Date content="3 days ago" />
            <Feed.Summary>
              You added <a>Molly Malone</a> as a friend.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>

        <Feed.Event>
          <Feed.Label image="/images/avatar/small/elliot.jpg" />
          <Feed.Content>
            <Feed.Date content="4 days ago" />
            <Feed.Summary>
              You added <a>Elliot Baker</a> to your <a>musicians</a> group.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </Card.Content>
  </Card>
);

function BlockAndTxn() {
  return <CardExampleContentBlock />;
  // <div className="page-block-txn" >
  //   <CardExampleContentBlock />
  //   <Wrapper>
  //     <StyledTabel className='left'>
  //       <Card>
  //         <Card.Content>
  //           <Card.Header>Recent Activity</Card.Header>
  //         </Card.Content>
  //         <Card.Content>
  //           <DataList />
  //         </Card.Content>
  //       </Card>
  //     </StyledTabel>
  //     <StyledTabel className='right'>
  //       <Card>
  //         <Card.Content>
  //           <Card.Header>Recent Activity</Card.Header>
  //         </Card.Content>
  //         <Card.Content>
  //           <DataList />
  //         </Card.Content>
  //       </Card>
  //     </StyledTabel>
  //   </Wrapper>
  // </div>;
}
export default CardExampleContentBlock;
