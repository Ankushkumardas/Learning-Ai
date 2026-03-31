LLM ---> are stateless and not history or context is been saved in thi sstate or manner or we have to add a history /cached token as history each and every time we make a new call and append it to teh new call as context

<!--  -->

Context window is teh main issue -->with limit of 4k to 128k tokens

<!--  -->

Memory in AI agents -->

1.Short Term Memory--> Temporary memory (kitna temporary..) like session
we keep this messaegs in teh "Redis" in that in "List" and we have a Cron job that syncs.. our message in teh mongodb database
--> like making the context to store the last 50 message --> where it will have 25 of users and 25 of ai's responce/answer to query

2.Long Term Memory--> remembering name


<!--  -->

if we make or context space very big it can lead to --> hallucinations
