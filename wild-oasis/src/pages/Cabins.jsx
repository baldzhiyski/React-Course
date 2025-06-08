import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import Heading from "../ui/Heading";

function Cabins() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Cabins</Heading>
        <p>Filter/Sort Here</p>
      </Row>

      <Row type="horizontal">
        <CabinTable />
      </Row>
    </>
  );
}

export default Cabins;
