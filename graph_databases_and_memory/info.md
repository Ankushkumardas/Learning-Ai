Graph_Memory:-
In vector embeddings we cannot have or explicitly have or get relationship between things (Relationships) 
uses graph traversel and also called knowledge graph

<!--  -->
LLM (Chat)
entity detection

<!--  -->
Graph DB's --> node edge node conncetions--each node has an _id->unique
neo4j
kuzu


<!-- In real prduction real application for memory we use both graph and vector databses -->as
user query-->vector embeddings-->search in qdrant db--> gives page number of top 3 nodes from graph db and call the relevant(4) nodes in the graph db and send it to the LLM (context ) for the final response

Cypher query is been used in neo4j