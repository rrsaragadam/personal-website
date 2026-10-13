// The tabbed sections, by the spread each one opens at. Tab colours are
// paper tabs bought in a mixed pack.
export const SECTIONS = [
  {
    id: 'now',
    label: 'Now',
    title: 'Now + systems',
    spread: 2,
    color: '#e2763a',
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Projects',
    spread: 3,
    color: '#d9b44a',
  },
  {
    id: 'work',
    label: 'Work',
    title: 'Work + toolkit',
    spread: 4,
    color: '#7fa37a',
  },
  {
    id: 'reading',
    label: 'Reading',
    title: 'Reading log',
    spread: 5,
    color: '#6b9cc4',
  },
  {
    id: 'trails',
    label: 'Trails',
    title: 'Trail log + map',
    spread: 6,
    color: '#c86d7f',
  },
  {
    id: 'contact',
    label: 'Say hi',
    title: 'Bucket list + contact',
    spread: 7,
    color: '#8b7bb8',
  },
] as const
