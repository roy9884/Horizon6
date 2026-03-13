from datetime import datetime

def get_horizon6_day(target_date_str):
    """
    2024년 1월 1일(월요일)을 'Day 1'로 기준을 잡고,
    입력된 날짜가 Horizon 6 기준으로 몇 번째 날인지 계산합니다.
    """
    # 기준일(Anchor Date) 설정: 2024-01-01
    anchor_date = datetime.strptime("2024-01-01", "%Y-%m-%d")
    
    # 대상 날짜
    target_date = datetime.strptime(target_date_str, "%Y-%m-%d")
    
    # 두 날짜간의 일수 차이 계산
    delta = target_date - anchor_date
    days_diff = delta.days
    
    # 6일 주기 나머지 연산
    # 나머지가 0 -> Day 1, 1 -> Day 2, ..., 5 -> Day 6
    day_index = (days_diff % 6) + 1
    
    return f"Day {day_index}"

if __name__ == "__main__":
    # 오늘 날짜를 기준으로 테스트
    today_str = datetime.now().strftime("%Y-%m-%d")
    h6_day = get_horizon6_day(today_str)
    
    print("-" * 40)
    print(f"기준일 (Day 1): 2024-01-01")
    print("-" * 40)
    print(f"오늘 날짜: {today_str}")
    print(f"Horizon 6 요일: {h6_day}")
    print("-" * 40)
    
    # 다른 날짜 예시
    test_dates = ["2024-01-02", "2024-01-07", "2024-12-31"]
    for date in test_dates:
        print(f"'{date}' -> {get_horizon6_day(date)}")
