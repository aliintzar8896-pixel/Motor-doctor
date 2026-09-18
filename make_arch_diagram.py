import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_arch_diagram(filename='arch_diagram_motor_doctor.png'):
    fig, ax = plt.subplots(figsize=(14, 6), dpi=300)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')

    tier_colors = ['#f8fafc', '#f0fdf4', '#eff6ff', '#fefce8']
    border_colors = ['#475569', '#16a34a', '#2563eb', '#ca8a04']

    # 4 Tiers:
    # 1. Client Tier (Browser / Mobile / Driver / Mechanic)
    # 2. Presentation & Routing Tier (React 18, Vite, React Router DOM, Tailwind CSS)
    # 3. Application Logic & Services Tier (AppContext State, SOS Dispatch Engine, Live Tracking, Bill Doctor Engine)
    # 4. Data & Integration Tier (Mock Database / LocalStorage / REST API / Telematics)

    tiers = [
        ("CLIENT TIER", ["Web Browser (Chrome/Edge)", "Mobile Responsive UI", "Driver & Mechanic Portals"], 0.5),
        ("PRESENTATION TIER", ["React 18 & TypeScript", "Vite Development Engine", "Tailwind CSS & Glassmorphism", "Lucide React & Sonner UI"], 3.8),
        ("APPLICATION & LOGIC TIER", ["Global State (AppContext)", "SOS Emergency Dispatch Service", "Live Breakdown Stepper Engine", "Bill Doctor Consultation Audit"], 7.2),
        ("DATA & SERVICES TIER", ["In-Memory Data Models", "Breakdown & Mechanic Stores", "Service Pricing Knowledgebase", "Audio Alerts & Telematics API"], 10.6)
    ]

    for i, (title, items, x) in enumerate(tiers):
        rect = patches.FancyBboxPatch((x, 0.6), 2.9, 4.8, boxstyle="round,pad=0.03,rounding_size=0.08",
                                     linewidth=1.8, edgecolor=border_colors[i], facecolor=tier_colors[i])
        ax.add_patch(rect)
        # Header banner
        h_rect = patches.FancyBboxPatch((x, 4.8), 2.9, 0.6, boxstyle="round,pad=0.03,rounding_size=0.08",
                                       linewidth=1.5, edgecolor=border_colors[i], facecolor=border_colors[i])
        ax.add_patch(h_rect)
        ax.text(x + 1.45, 5.1, title, color='#ffffff', weight='bold', fontsize=10, ha='center', va='center')

        # Items
        for j, item in enumerate(items):
            iy = 4.2 - j * 1.05
            item_box = patches.FancyBboxPatch((x + 0.15, iy - 0.35), 2.6, 0.7, boxstyle="round,pad=0.02,rounding_size=0.05",
                                             linewidth=1.0, edgecolor='#cbd5e1', facecolor='#ffffff')
            ax.add_patch(item_box)
            ax.text(x + 1.45, iy, item, color='#1e293b', fontsize=8.5, ha='center', va='center', weight='semibold')

    # Connecting arrows between tiers
    arrow_props = dict(arrowstyle='<|-|>', lw=2.0, color='#1e293b', mutation_scale=15)
    for x_conn in [3.4, 6.8, 10.2]:
        arrow = patches.FancyArrowPatch((x_conn, 3.0), (x_conn + 0.4, 3.0), **arrow_props)
        ax.add_patch(arrow)
        ax.text(x_conn + 0.2, 3.3, "HTTP / State", fontsize=7.5, ha='center', va='bottom',
                color='#475569', weight='bold')

    ax.set_xlim(0, 14)
    ax.set_ylim(0, 6)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated {filename}")

if __name__ == '__main__':
    create_arch_diagram()
