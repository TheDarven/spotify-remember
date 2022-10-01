export interface SpotifyResponse<T> {
    body: T
    headers: Record<string, string>
    statusCode: number
}
