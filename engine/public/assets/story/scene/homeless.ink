=== scene_homeless ===

# speaker: 노숙자
# emotion: nervous
저... 실례합니다. 혹시... 물건을 좀 살 수 있을까 해서요.

* [친절응대]
    # speaker: 잡화점 사장
    # emotion: friendly
    네, 어서 오세요. 찾으시는 물건이라도 있으신가요?
    -> homeless_kind

* [싹퉁응대]
    # speaker: 잡화점 사장
    가게 안에 냄새 배니까 용건만 빨리 말씀하세요.
    -> homeless_rude

// ============================
// 분기 A: 친절응대
// ============================
= homeless_kind

# speaker: 노숙자
# emotion: normal
아, 다행이네요. 행색이 이래서 문전박대당할까 봐 걱정했는데... 

# speaker: 노숙자
혹시 값싼 방석 하나 있을까요? 딱딱한 바닥에 오래 앉아 있기가 힘들어서요.


    * [방석 있음]
        # speaker: 잡화점 사장
     네, 여기 있습니다. 두툼해서 오래 앉아 있어도 배기지 않을 거예요.
        -> homeless_kind_sell

    * [방석 없음]
        # speaker: 잡화점 사장
        아이고, 어쩌죠? 방금 마지막 방석이 다 나가버렸네요.
        -> homeless_kind_nosell

= homeless_kind_sell

# speaker: 노숙자
# emotion: grateful
예, 고맙습니다. 제가 좀 오래 기다려야 할 곳이 있는데, 나이가 들어서 그런지 엉덩이가 배겨서요... 덕분에 좀 버틸 수 있겠네요.

-> DONE

= homeless_kind_nosell

# speaker: 노숙자
# emotion: disappointed
아... 그렇군요. 괜찮습니다. 그냥 제가 더 참아보겠습니다.

-> DONE

// ============================
// 분기 B: 싹퉁응대
// ============================
= homeless_rude

# speaker: 노숙자
# emotion: flustered
죄송합니다... 금방 나갈게요. 그... 그냥 의자에 두는 방석 하나만 있으면 되는데, 제일 싼 거로 좀 보여주시겠어요?

    * [방석 판매]
        # speaker: 잡화점 사장
        여기요. 5,000원입니다. 빨리 계산하고 가세요.
        -> homeless_rude_sell

    * [방석 판매 X]
        # speaker: 잡화점 사장
        품절됐네요. 다른 데 가서 알아보세요.
        -> homeless_rude_nosell

= homeless_rude_sell

# speaker: 노숙자
# emotion: apologetic
아, 예... 여기요. 바로 나갈게요. 바쁘신데 번거롭게 해드려서 죄송합니다.

-> homeless_rude_end

= homeless_rude_nosell

# speaker: 노숙자
# emotion: dejected
아... 그렇군요. 제가 잘 몰랐습니다. 바로 나갈게요.
 
-> homeless_rude_end

= homeless_rude_end

# speaker: 노숙자
# emotion: sad
요즘 잠자리가 좀 시끄럽고 불편해서... 이거라도 있으면 좀 나을 것 같아 여쭤봤습니다.

-> DONE