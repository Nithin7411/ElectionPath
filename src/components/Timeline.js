export default function Timeline({ timeline, currentStage }) {
  const steps = [
    { id: "announcement", label: "Announcement", date: timeline.announcement, stage: "Upcoming" },
    { id: "voting", label: "Voting Day", date: timeline.voting, stage: "Voting Day" },
    { id: "results", label: "Results", date: timeline.results, stage: "Completed" }
  ];

  const getStepStatus = (stepStage) => {
    if (currentStage === "Completed") return "past";
    if (currentStage === "Voting Day") {
      if (stepStage === "Upcoming") return "past";
      if (stepStage === "Voting Day") return "active";
      return "future";
    }
    if (currentStage === "Upcoming") {
      if (stepStage === "Upcoming") return "active";
      return "future";
    }
    return "future";
  };

  return (
    <div style={{ margin: '2rem 0', position: 'relative', borderLeft: '2px solid var(--border-card)', paddingLeft: '2rem' }}>
      {steps.map((step, idx) => {
        const status = getStepStatus(step.stage);
        const isActive = status === "active";
        const isPast = status === "past";

        return (
          <div key={step.id} style={{ marginBottom: idx === steps.length - 1 ? 0 : '2rem', position: 'relative' }}>
            {/* Node circle */}
            <div style={{
              position: 'absolute',
              left: '-2.6rem',
              top: 0,
              width: '1.2rem',
              height: '1.2rem',
              borderRadius: '50%',
              background: isActive ? 'var(--primary)' : isPast ? 'var(--success)' : 'var(--bg-dark)',
              border: `2px solid ${isActive ? 'var(--primary)' : isPast ? 'var(--success)' : 'var(--border-card)'}`,
              boxShadow: isActive ? '0 0 10px var(--primary-glow)' : 'none',
              zIndex: 2
            }} />

            <h4 style={{ color: isActive ? '#fff' : isPast ? '#f8fafc' : 'var(--text-muted)' }}>
              {step.label}
            </h4>
            <p className="text-muted">{new Date(step.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
        );
      })}
    </div>
  );
}
