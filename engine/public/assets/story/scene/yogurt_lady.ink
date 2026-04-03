=== yogurt_visit_first ===
# event: char_enter:yogurt_lady

-> yogurt_talk_first

= yogurt_talk_first
# speaker: 요구르트 판매원
# event: char_talk:yogurt_lady
사장님, 안녕~ 오늘도 부지런하시네.

# speaker: 요구르트 판매원
# event: char_talk:yogurt_lady
# event: char_anim:yogurt_lady:happy
이 동네에서 제일 부지런한 건 역시 사장님 아닐까 싶어.

# speaker: 잡화점
# event: char_still:yogurt_lady
......

# speaker: 요구르트 판매원
# event: char_talk:yogurt_lady
# event: char_anim:yogurt_lady:simurok
어머~ 사장님!\\n그런데 오늘 얼굴색이 왜 이래?

# speaker: 요구르트 판매원
# event: char_talk:yogurt_lady
# event: char_anim:yogurt_lady:idle
아, 그렇지! 이번에 '슈퍼-울트라 요구르트'라고 신제품인데 한 번 마셔봐.

# speaker: 요구르트 판매원
# event: char_talk:yogurt_lady
# event: char_anim:yogurt_lady:bored
이 안에 뭐가 들었는지 알면 깜짝 놀랄 걸?

# speaker: 요구르트 판매원
# event: char_talk:yogurt_lady
# event: char_anim:yogurt_lady:happy
칼슘, 유산균, 그리고... [color=yellow]젊음![/color]

    * [사양한다]
        # speaker: 잡화점 사장
        # event: char_still:yogurt_lady
        # event: char_anim:yogurt_lady:angry
        또 요구르트야?\\n아침에 이미 마셨어.
        -> yogurt_exit

    * [거절한다]
        # speaker: 잡화점 사장
        # event: char_still:yogurt_lady
        # event: char_anim:yogurt_lady:angry
        이번에도 유통기한 지난 거 아냐?
        -> yogurt_exit

= yogurt_exit
# event: char_exit:yogurt_lady
-> DONE
