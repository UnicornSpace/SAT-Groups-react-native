"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/utils/axions-instance"
import { useAuth } from "@/utils/auth-context"

export const useBranchData = () => {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const fetchBranches = async () => {
    if (!token) {
      console.log("No auth token available")
      setError("Authentication required")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("Fetching branch data...")
      const response = await axiosInstance.get("/get-location.php", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("API Response:👍", response.data)

      const branchResponse = response.data
setLoading(false)
      // Handle different response structures
      let branchData = []
      if (branchResponse?.data && Array.isArray(branchResponse.data)) {
        branchData = branchResponse.data
      } else if (Array.isArray(branchResponse)) {
        branchData = branchResponse
      } else if (branchResponse?.branches && Array.isArray(branchResponse.branches)) {
        branchData = branchResponse.branches
      } else {
        console.error("Unexpected response structure:", branchResponse)
        // Try to extract any array from the response
        const possibleArrays = Object.values(branchResponse || {}).filter(Array.isArray)
        if (possibleArrays.length > 0) {
          branchData = possibleArrays[0] as any[]
          console.log("Found array in response:", branchData.length, "items")
        }
      }

      console.log("Setting branch data:", branchData.length, "branches")
      setBranches(branchData)

      // If no data found, set a user-friendly error
      if (branchData.length === 0) {
        setError("No branches available at the moment")
      }
    } catch (error: any) {
      console.error("Error fetching branch details:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to load branch information"
      setError(errorMessage)

      // Don't show alert for network errors, just log them
      console.log("API Error:", errorMessage)

      // Set some fallback data if available (you can customize this)
      setBranches([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [token])

  const refetch = () => {
    setError(null)
    fetchBranches()
  }

  return { branches, loading, error, refetch }
}
