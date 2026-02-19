# Admin Panel Extension Plan: Homepage Sections (V2 with Auditing)

**Status:** Ready to Implement
**Objective:** CRUD for Homepage Sections + automatic Audit Logging of all changes.

## 1. UI (Same as V1)
...

## 2. API / Supabase Interaction (Updated)

### `saveSection(data)`
```javascript
import { supabase } from '../../services/supabaseClient';

const saveSection = async (sectionData, userId) => {
    // 1. UPSERT Section
    const { data, error } = await supabase.from('homepage_sections').upsert(sectionData).select().single();
    
    if (error) return { error };

    // 2. AUDIT LOG (Fire & Forget)
    supabase.from('homepage_audit_logs').insert({
        section_id: data.id,
        action: sectionData.id ? 'UPDATE' : 'INSERT',
        changed_by: userId,
        payload_snapshot: sectionData.props
    });

    return { data };
};
```

### `deleteSection(id)`
```javascript
const deleteSection = async (activeSection, userId) => {
    // 1. DELETE
    const { error } = await supabase.from('homepage_sections').delete().eq('id', activeSection.id);
    
    if (error) return { error };

    // 2. AUDIT LOG
    supabase.from('homepage_audit_logs').insert({
        section_id: activeSection.id,
        action: 'DELETE',
        changed_by: userId,
        payload_snapshot: activeSection.props // Store what was deleted
    });
};
```

## 3. Observability
*   The `homepage_audit_logs` table will now track every change.
*   Future Feature: "Admin Activity Feed" using this table.
