from py2neo import Graph, Node, Relationship, NodeMatcher, Subgraph, RelationshipMatcher

g = Graph('http://localhost:7474', auth=('neo4j', 'deep-diary'))
matcher = NodeMatcher(g)
r_matcher = RelationshipMatcher(g)


# a_node = Node("Person", name='blue')
# b_node = Node("Person", name='susan')
# ab = Relationship(a_node, 'knows', b_node)
# g.create(ab)
#

# node1 = matcher.match('Person', name='blue').first()  # 返回第一个节点
# node2 = matcher.match('Person', name='susan').first()  # 返回第一个节点
# nodes = matcher.match('Person', name='blue').all()  # 返回所有节点
#
# relation = r_matcher.match(nodes=[node1, node2]).first()  # 查找关系
# # 删除关系及节点
# g.delete(relation)
# # 删除节点
# g.separate(relation)
#
# # 模糊匹配
# nodes = matcher.match('Person').where("_.name =~ '葛.*' ")
#
# # 更新单个节点
# tx = g.begin()
# node1['name'] = 'new name'
# sub = Subgraph(nodes=[node1])  # 如果是多个，把node变成一个列表就好
# tx.push(sub)
# tx.commit()


def match_node(m_graph, m_label, m_attrs):
    m_n = "_.name=" + "\'" + m_attrs['name'] + "\'"
    matcher = NodeMatcher(m_graph)
    re_value = matcher.match(m_label).where(m_n).first()
    return re_value


def match_relationship_by_note(m_graph, node1, node2):
    r_matcher = RelationshipMatcher(m_graph)
    relation = r_matcher.match(nodes=[node1, node2]).first()  # 查找关系
    return relation


# relation = r_matcher.match(nodes=[node1, node2]).first()  # 查找关系

# 创建节点
def create_note(m_graph, m_label, m_attrs):
    re_value = match_node(m_graph, m_label, m_attrs)
    print(re_value)
    if re_value is None:
        m_node = Node(m_label, **m_attrs)
        n = m_graph.create(m_node)
        return n
    return None


# 创建两个节点的关系，如果节点不存在，不创建关系
def create_relationship(m_graph, m_label1, m_attrs1, m_label2, m_attrs2, m_r_name):
    re_value1 = match_node(m_graph, m_label1, m_attrs1)
    re_value2 = match_node(m_graph, m_label2, m_attrs2)
    if re_value1 is None or re_value2 is None:
        return False
    m_r = Relationship(re_value1, m_r_name, re_value2)
    n = m_graph.create(m_r)
    return n


label = 'Stock'
attrs = {'name': 'deep-diary', 'code': '003456'}
attrs1 = {'name': 'deep-diary1', 'code': '003456'}
# label2 = 'Company'
# attrs2 = {'name': '深记网络科技', 'CTO': '葛维冬'}

label2 = 'Company'
attrs2 = {'name': '深记股份', 'CEO': '韩莉'}

note1 = create_note(g, label, attrs)
note2 = create_note(g, label2, attrs2)

re_value = create_relationship(g, label, attrs, label2, attrs2, '对应公司')
re_value2 = create_relationship(g, label2, attrs2, label, attrs, '股票代码')
re_value3 = create_relationship(g, label, attrs, label, attrs1, '母公司')
note = match_node(g, label, attrs)
relationship = list(r_matcher.match([note], r_type=None))

print('end')
