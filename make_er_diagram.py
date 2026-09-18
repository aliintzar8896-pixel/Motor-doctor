import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_er_diagram(filename='er_diagram_motor_doctor.png'):
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')

    primary_header = '#1e40af'      # deep blue
    secondary_header = '#0d9488'    # teal
    accent_header = '#d97706'       # amber
    box_bg = '#f8fafc'
    border_col = '#334155'
    text_dark = '#0f172a'
    attr_text = '#334155'
    pk_color = '#b91c1c'

    def draw_entity(x, y, w, h, title, attributes, header_bg=primary_header):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.08",
                                     linewidth=1.8, edgecolor=border_col, facecolor=box_bg)
        ax.add_patch(rect)
        hh = h * 0.22
        h_rect = patches.FancyBboxPatch((x, y + h - hh), w, hh, boxstyle="round,pad=0.02,rounding_size=0.08",
                                       linewidth=1.5, edgecolor=border_col, facecolor=header_bg)
        ax.add_patch(h_rect)
        ax.text(x + w/2, y + h - hh/2, title, color='#ffffff', weight='bold',
                fontsize=11, ha='center', va='center', family='sans-serif')
        start_y = y + h - hh - 0.08
        line_step = (h - hh - 0.12) / max(len(attributes), 1)
        for i, (name, typ, is_pk) in enumerate(attributes):
            curr_y = start_y - (i + 0.5) * line_step
            ax.text(x + 0.12, curr_y, name, color=text_dark, fontsize=8.5,
                    ha='left', va='center', family='monospace', weight='bold' if is_pk else 'normal')
            pk_label = "PK, " if is_pk == 'PK' else ("FK, " if is_pk == 'FK' else "")
            ax.text(x + w - 0.12, curr_y, f"{pk_label}{typ}", color=pk_color if is_pk else attr_text,
                    fontsize=8.5, ha='right', va='center', family='monospace')

    # Entities
    user_attrs = [
        ('user_id', 'int', 'PK'),
        ('full_name', 'varchar', False),
        ('phone', 'varchar', False),
        ('email', 'varchar', False),
        ('role', 'enum', False),
        ('vehicle_model', 'varchar', False),
        ('reg_number', 'varchar', False),
        ('created_at', 'timestamp', False)
    ]
    draw_entity(0.5, 4.2, 3.2, 3.8, 'USER / VEHICLE OWNER', user_attrs, primary_header)

    req_attrs = [
        ('request_id', 'int', 'PK'),
        ('user_id', 'int', 'FK'),
        ('mechanic_id', 'int', 'FK'),
        ('service_type', 'varchar', False),
        ('location_text', 'varchar', False),
        ('gps_coordinates', 'varchar', False),
        ('status', 'enum', False),
        ('otp_verification', 'varchar', False),
        ('created_at', 'timestamp', False)
    ]
    draw_entity(5.5, 4.0, 3.4, 4.2, 'EMERGENCY_REQUEST', req_attrs, primary_header)

    mech_attrs = [
        ('mechanic_id', 'int', 'PK'),
        ('name', 'varchar', False),
        ('phone', 'varchar', False),
        ('workshop_name', 'varchar', False),
        ('location_gps', 'varchar', False),
        ('rating', 'float', False),
        ('specialization', 'varchar', False),
        ('is_available', 'boolean', False)
    ]
    draw_entity(10.2, 5.0, 3.3, 3.8, 'MECHANIC_PARTNER', mech_attrs, secondary_header)

    track_attrs = [
        ('tracking_id', 'int', 'PK'),
        ('request_id', 'int', 'FK'),
        ('current_stage', 'enum', False),
        ('stage_step', 'int', False),
        ('eta_minutes', 'int', False),
        ('last_updated', 'timestamp', False)
    ]
    draw_entity(10.2, 0.5, 3.3, 3.3, 'DISPATCH_TRACKING', track_attrs, secondary_header)

    bill_attrs = [
        ('bill_id', 'int', 'PK'),
        ('user_id', 'int', 'FK'),
        ('car_model', 'varchar', False),
        ('issue_description', 'text', False),
        ('original_estimate', 'decimal', False),
        ('audited_fair_cost', 'decimal', False),
        ('potential_savings', 'decimal', False),
        ('audit_status', 'enum', False)
    ]
    draw_entity(0.5, 0.3, 3.2, 3.5, 'BILL_DOCTOR_AUDIT', bill_attrs, accent_header)

    # Relationships
    # Line 1: User -> Emergency Request
    ax.plot([3.7, 5.5], [6.1, 6.1], color='#334155', lw=1.8, zorder=2)
    ax.text(4.6, 6.35, 'initiates / requests', fontsize=8, weight='bold',
            ha='center', va='center', color='#1e293b',
            bbox=dict(boxstyle="round,pad=0.2", fc="#e2e8f0", ec="#94a3b8", lw=0.8))
    ax.text(3.85, 5.9, '1', fontsize=9, color='#475569', weight='bold')
    ax.text(5.35, 5.9, 'N', fontsize=9, color='#475569', weight='bold')

    # Line 2: Mechanic -> Emergency Request
    ax.plot([10.2, 8.9], [6.9, 6.9], color='#334155', lw=1.8, zorder=2)
    ax.text(9.55, 7.15, 'assigned_to', fontsize=8, weight='bold',
            ha='center', va='center', color='#1e293b',
            bbox=dict(boxstyle="round,pad=0.2", fc="#e2e8f0", ec="#94a3b8", lw=0.8))
    ax.text(10.05, 6.7, '1', fontsize=9, color='#475569', weight='bold')
    ax.text(9.05, 6.7, 'N', fontsize=9, color='#475569', weight='bold')

    # Line 3: Emergency Request -> Dispatch Tracking
    ax.plot([7.2, 7.2, 10.2], [4.0, 2.15, 2.15], color='#334155', lw=1.8, zorder=2)
    ax.text(8.7, 2.38, 'tracks real-time', fontsize=8, weight='bold', ha='center', va='center',
            bbox=dict(boxstyle="round,pad=0.2", fc="#e2e8f0", ec="#94a3b8", lw=0.8))
    ax.text(7.35, 3.8, '1', fontsize=9, color='#475569', weight='bold')
    ax.text(9.95, 1.95, '1', fontsize=9, color='#475569', weight='bold')

    # Line 4: User -> Bill Doctor Audit
    ax.plot([2.1, 2.1], [4.2, 3.8], color='#334155', lw=1.8, zorder=2)
    ax.text(2.6, 4.0, 'submits estimate', fontsize=8, weight='bold', ha='left', va='center',
            bbox=dict(boxstyle="round,pad=0.2", fc="#e2e8f0", ec="#94a3b8", lw=0.8))
    ax.text(1.9, 4.08, '1', fontsize=9, color='#475569', weight='bold')
    ax.text(1.9, 3.85, 'N', fontsize=9, color='#475569', weight='bold')

    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated {filename}")

if __name__ == '__main__':
    create_er_diagram()
