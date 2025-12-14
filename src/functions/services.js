import supabase from '../config/supabase.js'

// Get Service ID
export const findServiceId = async (serviceName) => {
    const { data, error } = await supabase
        .from('services')
        .select('id')
        .eq('name', serviceName)
        .order('name', { ascending: true })
    if (error) {
        console.error('Error fetching service id:', error)
        return null
    }
    const serviceId = data || []
    return serviceId.map(service => service.id) || null
}

// Find Services
export const findServices = async () => {
    const { data, error } = await supabase
        .from('services')
        .select('id:name, title:name')
        .order('name', { ascending: true })
    if (error) {
        console.error('Error fetching services:', error)
        return null
    }
    const servicesArray = data || []
    return servicesArray || null
}

// Find Service Duration
export const findServicesDuration = async (serviceName) => {
    const { data, error } = await supabase
        .from('services')
        .select('duration')
        .eq('name', serviceName)
        .order('name', { ascending: true })
    if (error) {
        console.error('Error fetching service duration:', error)
        return null
    }
    const servicesArray = data || []
    return servicesArray.map(service => service.duration) || null
}