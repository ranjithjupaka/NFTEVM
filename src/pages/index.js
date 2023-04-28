import NftDetails from "./NftDetails";
import CollectionDetails from "./CollectionDetails";
import CreateCollection from "./CreateCollection";
import CreateNFT from "./CreateNFT";
import Nfts from "./Nfts";
import MyNfts from "./MyNfts";
import Collections from "./Collections";
import MyCollections from "./MyCollections";
import AuctionDetails from "./AuctionDetails";
import FreeMint from "./FreeMint";

const routes = [
  { path: '/', component: <Collections />},
  { path: '/create', component: <CreateCollection />},
  { path: '/mint/:colId', component: <CreateNFT />},
  { path: '/nfts', component: <Nfts />},
  { path: '/my-nfts', component: <MyNfts />},
  { path: '/nft/:nftid', component: <NftDetails />},
  { path: '/bid/:nftid', component: <AuctionDetails />},
  { path: '/collections', component: <Collections />},
  { path: '/my-collections', component: <MyCollections />},
  { path: '/collection/:colId', component: <CollectionDetails />},
  { path: '/freemint', component: <FreeMint />},
]

export default routes;