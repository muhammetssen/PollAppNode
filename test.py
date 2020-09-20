import requests

poll = {
    'question': 'How are you',
    'options': ['Good', 'Bad'],
    'allowMultiChoice': True,
    'IPCheck': True,
}

vote = {
    'pollId': '5f6733bb1b011817f06f56ac',
    'selectedOptionIndex': [0],
}

requests.post(
    url = 'http://localhost:8080/poll/create', #35.209.140.129:8082
    json= poll
)

# requests.post(
#     'http://35.209.140.129:8082//poll/vote',
#     json=vote)
