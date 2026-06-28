TAG_RULES: dict[str, list[str]] = {
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


def auto_tag(content: str) -> list[str]:
    normalized = content.lower()
    return [
        tag
        for tag, keywords in TAG_RULES.items()
        if any(keyword in normalized for keyword in keywords)
    ]
