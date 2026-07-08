import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/VerticalTimeline.css';

/**
 * VerticalTimeline
 * ----------------
 * A mobile-only, scroll-driven vertical timeline. Milestones fade/rise into
 * place as the user scrolls, their node ignites with a glow, and a gold
 * light-trail fills the spine in sync with scroll progress. Ends with a
 * "Continue" button that reveals once the last milestone has appeared.
 *
 * Install peer dependencies:
 *   npm install gsap
 */

gsap.registerPlugin(ScrollTrigger);

export interface TimelineMilestone {
  id: string;
  date: string;
  photoUrl: string;
  title: string;
  description: string;
}

export interface VerticalTimelineProps {
  milestones: TimelineMilestone[];
  /** Called when the user taps "Continue" at the end of the timeline. */
  onContinue?: () => void;
  className?: string;
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ milestones, onContinue, className }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const spineFillRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [continueVisible, setContinueVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gold light-trail fills the spine in sync with overall scroll progress.
      if (spineFillRef.current && rootRef.current) {
        gsap.fromTo(
          spineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: 0.6,
            },
          }
        );
      }

      // Each card rises + fades in as it enters the viewport; its node
      // ignites at the same moment. Reverses smoothly on scroll-back.
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const node = nodeRefs.current[i];

        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 64, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
              onEnter: () => node?.classList.add('is-active'),
              onEnterBack: () => node?.classList.add('is-active'),
              onLeaveBack: () => node?.classList.remove('is-active'),
            },
          }
        );
      });

      // Reveal the Continue button once the end sentinel scrolls into view.
      if (endRef.current) {
        ScrollTrigger.create({
          trigger: endRef.current,
          start: 'top 92%',
          onEnter: () => setContinueVisible(true),
          onLeaveBack: () => setContinueVisible(false),
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [milestones]);

  return (
    <div className={`vt-root ${className ?? ''}`} ref={rootRef}>
      <div className="vt-bg" aria-hidden="true">
        <span className="vt-orb vt-orb--a" />
        <span className="vt-orb vt-orb--b" />
        <span className="vt-orb vt-orb--c" />
      </div>

      <div className="vt-track">
        <div className="vt-spine">
          <div className="vt-spine-fill" ref={spineFillRef} />
        </div>

        <ul className="vt-list">
          {milestones.map((m, i) => (
            <li className="vt-item" key={m.id}>
              <div className="vt-node-wrap">
                <div
                  className="vt-node"
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                >
                  <span className="vt-node-core" />
                </div>
              </div>

              <div
                className="vt-card"
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <span className="vt-date">{m.date}</span>
                <div className="vt-photo-wrap">
                  <img src={m.photoUrl} alt={m.title} className="vt-photo" loading="lazy" />
                </div>
                <h3 className="vt-title">{m.title}</h3>
                <p className="vt-desc">{m.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="vt-end" ref={endRef}>
          <button
            type="button"
            className={`vt-continue ${continueVisible ? 'vt-continue--visible' : ''}`}
            onClick={onContinue}
            disabled={!continueVisible}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerticalTimeline;