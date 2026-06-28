from tagging import TAG_RULES, auto_tag


def test_tag_rules_are_exact():
    assert TAG_RULES == {
        "coding": [
            "code",
            "programming",
            "python",
            "javascript",
            "api",
            "github",
            "claude",
            "cursor",
            "ai agent",
            "llm",
            "vibe cod",
        ],
        "finance": [
            "trading",
            "crypto",
            "stocks",
            "investing",
            "polymarket",
            "options",
            "portfolio",
        ],
        "food": [
            "recipe",
            "cook",
            "ingredient",
            "bake",
            "restaurant",
            "meal",
            "food",
        ],
        "marketing": ["cold email", "outreach", "lead", "saas", "funnel", "conversion"],
        "design": ["ui", "ux", "figma", "design", "landing page", "animation", "framer"],
        "fitness": ["workout", "gym", "exercise", "protein", "calories", "training"],
    }


def test_each_category_matches():
    examples = {
        "coding": "This Python API example is concise.",
        "finance": "The portfolio includes crypto exposure.",
        "food": "This recipe needs one ingredient.",
        "marketing": "Cold email outreach improved conversion.",
        "design": "The Figma animation supports the landing page.",
        "fitness": "Protein matters after a workout.",
    }

    for tag, content in examples.items():
        assert auto_tag(content) == [tag]


def test_multi_tag_content_preserves_rule_order():
    assert auto_tag("Python recipe with Figma workout notes") == [
        "coding",
        "food",
        "design",
        "fitness",
    ]


def test_no_match_returns_empty_list():
    assert auto_tag("A plain note about errands.") == []


def test_matching_is_case_insensitive():
    assert auto_tag("GITHUB and POLYMARKET") == ["coding", "finance"]
