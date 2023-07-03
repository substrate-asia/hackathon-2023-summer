package p2p

const (
	kindDistributor PeerKind = iota + 1
	kindMiner
	kindValidator
)

const (
	pidFindPeerReq  = "/find_peer_req/1.0.0"
	pidFindPeerResp = "/find_peer_resp/1.0.0"
)
