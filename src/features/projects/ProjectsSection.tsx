import { PROJECTS } from '@/content/projects'
import { SectionHeading } from '@/features/ui/SectionHeading'
import { Reveal } from '@/features/ui/Reveal'
import { ProjectCard } from './ProjectCard'

export function ProjectsSection() {
  const [featured, ...rest] = PROJECTS
  return (
    <section
      id="projects"
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
    >
      <Reveal>
        <div data-reveal>
          <SectionHeading index="01" eyebrow="Selected work">
            Things I’ve{' '}
            <span className="font-display font-normal italic">made</span>
          </SectionHeading>
        </div>
        <div className="flex flex-col gap-16">
          <ProjectCard project={featured} featured />
          <div className="grid gap-16 md:grid-cols-2 md:gap-8">
            {rest.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
