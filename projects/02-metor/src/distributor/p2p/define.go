package p2p

const (
	kindDistributor PeerKind = iota + 1
	kindMiner
	kindValidator
)

const (
	pidFindPeerReq   = "/find_peer_req/1.0.0"
	pidFindPeerResp  = "/find_peer_resp/1.0.0"
	pidFindValueReq  = "/find_value_req/1.0.0"
	pidFindValueResp = "/find_value_resp/1.0.0"
	pidSaveBlockReq  = "/save_block/1.0.0"
	pidGetBlockReq   = "/get_block_req/1.0.0"
	pidGetBlockResp  = "/get_block_resp/1.0.0"
)
