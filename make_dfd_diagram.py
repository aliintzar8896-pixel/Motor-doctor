import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_dfd_diagram(filename='dfd_diagram_motor_doctor.png'):
    fig, ax = plt.subplots(figsize=(16, 8.5), dpi=300)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')

    # Styles
    entity_bg = '#f1f5f9'
    entity_border = '#0f172a'
    proc_bg = '#eff6ff'
    proc_border = '#1d4ed8'
    store_bg = '#fefce8'
    store_border = '#854d0e'
    text_color = '#0f172a'
    arrow_color = '#1e293b'

    def draw_ext_entity(x, y, w, h, text):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="square,pad=0",
                                     linewidth=2.2, edgecolor=entity_border, facecolor=entity_bg)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, text, color=text_color, weight='bold',
                fontsize=10.5, ha='center', va='center', wrap=True)

    def draw_process(x, y, w, h, num, text):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.08",
                                     linewidth=2.0, edgecolor=proc_border, facecolor=proc_bg)
        ax.add_patch(rect)
        # top line for process ID
        ax.plot([x, x + w], [y + h - 0.4, y + h - 0.4], color=proc_border, lw=1.2)
        ax.text(x + w/2, y + h - 0.2, num, color=proc_border, weight='bold',
                fontsize=9.5, ha='center', va='center')
        ax.text(x + w/2, y + (h - 0.4)/2, text, color=text_color, weight='bold',
                fontsize=9.5, ha='center', va='center', multialignment='center')

    def draw_datastore(x, y, w, h, d_id, text):
        # Open ended rectangle (top and bottom horizontal lines, left vertical line)
        rect = patches.Rectangle((x, y), w, h, linewidth=2.0, edgecolor=store_border, facecolor=store_bg)
        ax.add_patch(rect)
        # Draw double lines on left
        ax.plot([x + 0.6, x + 0.6], [y, y + h], color=store_border, lw=1.5)
        ax.text(x + 0.3, y + h/2, d_id, color=store_border, weight='bold',
                fontsize=10, ha='center', va='center')
        ax.text(x + 0.7 + (w - 0.7)/2, y + h/2, text, color=text_color, weight='bold',
                fontsize=9.5, ha='center', va='center', multialignment='center')

    def draw_flow(x1, y1, x2, y2, text, rad=0.0, label_offset=(0, 0.15)):
        arrow = patches.FancyArrowPatch((x1, y1), (x2, y2),
                                       connectionstyle=f"arc3,rad={rad}",
                                       arrowstyle='-|>', mutation_scale=14,
                                       lw=1.5, color=arrow_color, zorder=3)
        ax.add_patch(arrow)
        mid_x = (x1 + x2) / 2 + label_offset[0]
        mid_y = (y1 + y2) / 2 + label_offset[1]
        ax.text(mid_x, mid_y, text, fontsize=8, ha='center', va='center',
                bbox=dict(boxstyle="square,pad=0.2", fc="#ffffff", ec="#cbd5e1", lw=0.6), zorder=4)

    # 1. External Entities (Left)
    draw_ext_entity(0.5, 5.0, 2.5, 1.4, 'Vehicle Owner\n/ Driver')
    draw_ext_entity(0.5, 1.8, 2.5, 1.4, 'Mechanic\nPartner')

    # 2. Processes (Middle Columns)
    # Column A: Core Requests
    draw_process(4.2, 6.4, 2.8, 1.3, '1.0', 'User & Vehicle\nRegistration')
    draw_process(4.2, 4.4, 2.8, 1.3, '2.0', 'SOS Highway\nAssistance Dispatch')
    draw_process(4.2, 2.4, 2.8, 1.3, '3.0', 'Live GPS Tracking\n& OTP Verification')
    draw_process(4.2, 0.4, 2.8, 1.3, '4.0', 'Bill Doctor Repair\nEstimate Audit')

    # 3. Data Stores (Middle-Right)
    draw_datastore(8.4, 6.4, 3.2, 1.2, 'D1', 'User & Vehicle\nDatabase')
    draw_datastore(8.4, 4.4, 3.2, 1.2, 'D2', 'Emergency Dispatch\n& Tracking Records')
    draw_datastore(8.4, 2.4, 3.2, 1.2, 'D3', 'Mechanic Partners\nDirectory')
    draw_datastore(8.4, 0.4, 3.2, 1.2, 'D4', 'Bill Audit &\nEstimate Records')

    # 4. Process 5: Dispatch Coordinator (Right)
    draw_process(12.7, 4.4, 2.8, 1.3, '5.0', 'Mechanic Assignment\n& Dispatch Mgmt')
    draw_ext_entity(12.7, 1.5, 2.8, 1.3, 'Bill Doctor Audit\nSpecialist / Admin')

    # Flows from Entities to Processes
    draw_flow(3.0, 5.8, 4.2, 7.0, 'User Details & Vehicle', rad=0.08, label_offset=(-0.1, 0.15))
    draw_flow(3.0, 5.4, 4.2, 5.1, 'SOS Alert & GPS Location', rad=0.0, label_offset=(0, 0.15))
    draw_flow(3.0, 5.1, 4.2, 3.2, 'Verify OTP & Track Status', rad=-0.08, label_offset=(-0.1, -0.15))
    draw_flow(3.0, 5.0, 4.2, 1.1, 'Service Bill Estimate', rad=-0.15, label_offset=(-0.1, -0.2))

    # Flows from Mechanic to Processes
    draw_flow(3.0, 2.5, 4.2, 2.9, 'Accept Job / Status Updates', rad=0.05, label_offset=(-0.1, 0.15))
    draw_flow(3.0, 2.1, 8.4, 2.8, 'Mechanic Profile Data', rad=-0.05, label_offset=(-0.2, -0.15))

    # Flows between Processes and Data Stores
    draw_flow(7.0, 7.05, 8.4, 7.05, 'Store Profile', rad=0.0, label_offset=(0, 0.15))
    draw_flow(7.0, 5.05, 8.4, 5.05, 'Log SOS Request', rad=0.0, label_offset=(0, 0.15))
    draw_flow(7.0, 3.05, 8.4, 3.05, 'Update Stage & ETA', rad=0.0, label_offset=(0, 0.15))
    draw_flow(7.0, 1.05, 8.4, 1.05, 'Store Bill Estimate', rad=0.0, label_offset=(0, 0.15))

    # Flows to/from Process 5.0
    draw_flow(11.6, 5.2, 12.7, 5.2, 'Dispatch Order', rad=0.0, label_offset=(0, 0.15))
    draw_flow(11.6, 2.8, 12.7, 4.6, 'Nearby Mechanics', rad=0.08, label_offset=(0.1, 0.15))
    draw_flow(14.1, 4.4, 14.1, 2.8, 'Dispatch Status & Alerts', rad=0.0, label_offset=(0.6, 0))
    draw_flow(12.7, 1.8, 10.0, 1.6, 'Audit Review & Fair Cost', rad=-0.12, label_offset=(0.1, -0.2))

    ax.set_xlim(0, 16)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated {filename}")

if __name__ == '__main__':
    create_dfd_diagram()
