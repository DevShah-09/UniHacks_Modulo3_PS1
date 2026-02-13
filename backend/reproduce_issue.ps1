$email = "testuser_$(Get-Random)@example.com"
$password = "password123"
$baseUrl = "http://localhost:5000/api"

Write-Host "Registering user: $email"
try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body @{
        fullName = "Test User"
        email = $email
        password = $password
        department = "Engineering"
    }
    $token = $regResponse.token
    Write-Host "Registered. Token: $token"
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Response: $($reader.ReadToEnd())"
    }
    exit 1
}

Write-Host "Creating Organization..."
try {
    $headers = @{ Authorization = "Bearer $token" }
    $orgResponse = Invoke-RestMethod -Uri "$baseUrl/organizations" -Method Post -Headers $headers -Body @{
        name = "Test Org"
        description = "A test organization"
    }
    Write-Host "Organization created: $($orgResponse.name)"
} catch {
    Write-Host "Create Organization failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Response: $($reader.ReadToEnd())"
    }
}
