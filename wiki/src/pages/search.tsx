import { Masthead } from '@/components/masthead'

// STUB (leg-Search builds the body): the query field that owns the viewport top
// and the ranked result rows with matched-term highlight, plus the ⌘K palette.
export function SearchPage() {
  return (
    <>
      <Masthead overline="Find" title="Search" />
      <p className="mt-8 font-sans text-body text-muted-foreground md:mt-12">
        TODO (leg-Search): query field + ranked result rows, reachable via ⌘K.
      </p>
    </>
  )
}
