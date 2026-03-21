1.Prompting styles
-->Alpaca prompting  
 ex:--> instruction:\n### Input:\n Responce:

-->INST formate (LLaMA-2)
  ex:-->[INST]what are you doing?[/INST] 


    
Chat ML(Open AI)---> insdustry standard formate
    --->message=[{role:"user|assistant|system|..","content":"what is your name"}]

<!-- System prompt --> these are the initial instructions given to ai LLM model to give responce according to that message only and in that context only which is used to make conetxt based chat and to make thi system promot in teh very first instruction in teh code the initial role will be system and content will be system prompt
<!-- types of system prompt -->
1.Zero -shot prompting-->the model is given a direct question or task without any prior examples/context 
2.Few -shot prompting-->the model is given a direct question or task with some examples/context to teh LLM to make it understand the task better will will add exmaple liek real query and repsonce to teh LLM 100 - 150 example to give before 
3.Chain of Thought prompting-->the model is given a direct question or task -->the model is encouraged to break doewn teh reasoing step by step befpre arriving to an answer
4.self -consistency promopting-->   same query give to 2 dffent models get the responce and with teh more advnace model tak teh 2 responces and with that model get th emore accurate responce and send as outout 
5.persona based prompting--> can make someone's identity persona
<!-- llm as a judge -->