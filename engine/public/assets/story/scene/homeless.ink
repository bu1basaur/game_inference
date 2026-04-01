=== homeless_visit_first ===
# event: char_enter:homeless

-> homeless_wait

= homeless_wait
# speaker: 노숙자
# emotion: nervous
저... 실례합니다.\\n혹시... 물건을 좀 살 수 있을까 해서요.

* [친절응대]
    # speaker: 잡화점 사장
    # emotion: friendly
    어서 오세요. 찾으시는 물건이 있으신가요?
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
혹시 값싼 [color=red]방석[/color] 하나 있을까요?\\n딱딱한 바닥에 오래 앉아 있기가 힘들어서요.


    * [방석 있음]
        # speaker: 잡화점 사장
        # event: open_inventory:방석:homeless
     네, 여기 있습니다. 두툼해서 오래 앉아 있어도 배기지 않을 거예요.
        -> homeless_kind_sell

    * [방석 없음]
        # speaker: 잡화점 사장
        아이고, 어쩌죠? 방금 마지막 방석이 다 나가버렸네요.
        -> homeless_kind_nosell

= homeless_kind_sell

# speaker: 노숙자
# emotion: grateful
예, 고맙습니다. 제가 좀 오래 기다려야 할 곳이 있는데,\\n나이가 들어서 그런지 엉덩이가 배겨서요... 덕분에 좀 버틸 수 있겠네요.

-> homeless_phonebook

= homeless_kind_nosell

# speaker: 노숙자
# emotion: disappointed
아... 그렇군요. 괜찮습니다. 그냥 제가 더 참아보겠습니다.

-> homeless_phonebook

// ============================
// 분기 B: 싹퉁응대
// ============================
= homeless_rude

# speaker: 노숙자
# emotion: flustered
죄송합니다... 금방 나갈게요.

# speaker: 노숙자
그... 그냥 의자에 두는 [color=red]방석[/color] 하나만 있으면 되는데, 제일 싼 거로 좀 보여주시겠어요?

    * [방석 판매]
        # speaker: 잡화점 사장
        # event: open_inventory:방석:homeless
        여기요. 빨리 계산하고 가세요.
        -> homeless_rude_sell

    * [방석 판매 X]
        # speaker: 잡화점 사장
        품절됐네요. 다른 데 가서 알아보세요.
        -> homeless_rude_nosell

= homeless_rude_sell

# speaker: 노숙자
# emotion: apologetic
아, 예... 여기요. 바로 나갈게요.\\n바쁘신데 번거롭게 해드려서 죄송합니다.

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

-> homeless_phonebook

// ============================
// 전화번호부 대화로 이어짐
// ============================
= homeless_phonebook

# speaker: 노숙자
저... 사장님. 저기 구석에 있는 [color=blue]전화번호부[/color]도 혹시 파시는 건가요? 꽤 오래된 것 같긴 한데...

# speaker: 잡화점 사장
저거요? 요즘은 아무도 안 봐서 그냥 버리려던 건데...

# speaker: 잡화점 사장
왜요, 뭐 일자리라도 알아보시게요?\\n구인구직 정보 같은 거 찾으시나 봐요.

# speaker: 노숙자
아... 예, 뭐 그런 셈이죠.\\n제가 예전에 일하던 곳 사람들이랑 연락이 끊겨서요.

# speaker: 노숙자
요즘은 다들 휴대폰 쓰다지만, 저는 그런 게 없어서...

# speaker: 노숙자
혹시나 옛날 가게 번호라도 남아있나 찾아보려고요.

    * [전화번호부를 건넨다.]
        # speaker: 잡화점 사장
        # event: open_inventory:전화번호부:homeless
        뭐, 어차피 버리려던 거니까 가져가세요.
        -> homeless_phonebook_give

    * [전화번호부를 건네지 않는다.]
        # speaker: 잡화점 사장
        아, 생각해보니 저기 메모해둔 게 있어서 안 되겠네요. 나중에 제가 버릴게요.
        -> homeless_phonebook_deny

= homeless_phonebook_give
# event: worklog:노숙자에게 전화번호부를 줌

# speaker: 노숙자
# emotion: grateful
정말 감사합니다.\\n사장님처럼 좋은 분만 계셨어도 제가 이렇게까지 고생은 안 했을 텐데...

# speaker: 노숙자
덕분에 큰 도움 받았습니다.

-> homeless_give_exit

= homeless_phonebook_deny
# event: worklog:노숙자가 전화번호부를 요청했으나 거절

# speaker: 노숙자
# emotion: disappointed
아... 그렇군요. 알겠습니다.\\n제가 너무 염치없이 굴었네요.

# speaker: 노숙자
죄송합니다. 그냥 가보겠습니다.

-> homeless_give_exit

= homeless_give_exit
# event: char_exit:homeless
-> DONE

