package p2p

const (
	kindDistributor PeerKind = iota + 1
	kindMiner
	kindValidator
)

const (
	pidFindPeerReq  = "/find_peer_req"
	pidFindPeerResp = "/find_peer_resp"
	pidSaveFile     = "/save_file"
)
