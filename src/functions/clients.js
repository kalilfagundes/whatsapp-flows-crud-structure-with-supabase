// Find Cliente ID by Name

export const findClientId = async (clientName) => {
    const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('name', clientName)
        .order('name', { ascending: true })
    if (error) {
        console.error('Error fetching client ID:', error)
        return null
    }
    return data[0]?.id || null
}

// Find Cliente ID by Phone

export const findClientIdByPhone = async (clientPhone) => {
    const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', clientPhone)
        .order('phone', { ascending: true })
    if (error) {
        console.error('Error fetching client ID:', error)
        return null
    }
    return data[0]?.id || null
}